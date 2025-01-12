import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'contacts',
      transformation: [{ width: 350, height: 350, crop: 'fill' }],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to cloudinary:', error);
    throw error;
  }
};
