import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("MongoURI: ", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connection: ", error.message);
    process.exit(1); // 1 means exit with failure, 0 means exit with success
  }
}