import mongoose from 'mongoose';
import { getEnvVars } from '../utils/getEnvVars.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVars('MONGODB_USER');
    const pwd = getEnvVars('MONGODB_PASSWORD');
    const url = getEnvVars('MONGODB_URL');
      const db = getEnvVars('MONGODB_DB');
     

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
}; 

