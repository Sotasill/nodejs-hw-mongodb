import mongoose from 'mongoose';
import Contact from '../models/contact.js';

const importContacts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    
   
    const contacts = await Contact.find();
    console.log('Контакти успішно отримані:', contacts); 
  } catch (error) {
    console.error('Помилка при отриманні контактів:', error);
  } finally {
    mongoose.connection.close();
  }
};

export default importContacts;
