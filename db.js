import mongoose from "mongoose";

const connectDB = async () => {
    
    try {
        const mongourl=process.env.MONGO_URL;
            if (!mongourl) {
                throw new Error("MONGO_URL environment variable is not defined");
            }
        await mongoose.connect(mongourl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;