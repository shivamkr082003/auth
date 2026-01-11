import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserModel = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserModel);

export default User;