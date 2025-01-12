import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

const { connect } = mongoose;

export const initMongoDB = async () => {
  try {
    const uri = getEnvVar('BD_HOST');
    await connect(uri);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
