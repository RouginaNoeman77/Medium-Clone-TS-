import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
