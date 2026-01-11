import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import UserModel from "./models/user.js";
import { signupSchema, loginSchema } from "./zodSchema.js";
import OTP from "./models/otp.js";
import mailSender from "./utils/mailSender.js";
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use(express.json());

app.post("/api/v1/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // user already exists?
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // delete old OTPs
    await OTP.deleteMany({ email });

    // save OTP
    await OTP.create({ email, otp });

    // send email
    await mailSender(
      email,
      "OTP Verification",
      `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
    );

    return res.status(200).json({
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
});




app.post("/api/v1/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await OTP.findOne({ email })
      .sort({ createdAt: -1 });

    if (!otpDoc || otpDoc.otp !== String(otp)) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // mark OTP verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "OTP verification failed",
    });
  }
});




app.post("/api/v1/signup", async (req, res) => {
  try {
    const { username, email, password } = signupSchema.parse(req.body);

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with email or username already exists",
      });
    }

    // ✅ CHECK OTP VERIFICATION FROM OTP COLLECTION
    const verifiedOtp = await OTP.findOne({
      email,
      isVerified: true,
    });

    if (!verifiedOtp) {
      return res.status(403).json({
        message: "Please verify OTP first",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // 🧹 cleanup OTP
    await OTP.deleteMany({ email });

    return res.status(201).json({
      message: "User signed up successfully",
      username,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map(err => err.message),
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});



app.post("/api/v1/signin", async(req, res) => {
    try {
    // ✅ Validate input
    const { email, password } = loginSchema.parse(req.body);

    // ✅ Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Success response
    return res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    // ❌ Zod error
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map(err => err.message),
      });
    }

    // ❌ Server error
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});




const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log("Server is running on port 3000");
    connectDB();
});