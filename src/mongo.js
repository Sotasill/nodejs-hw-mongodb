import mongoose from 'mongoose';

const connectDB = async () => {
  console.log('MongoDB URL:', process.env.MONGODB_URL);
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
