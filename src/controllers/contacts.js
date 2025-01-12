import {
  listContacts,
  getContactById as getContactByIdService,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContactById,
} from '../services/contacts.js';
import { calculatePagination } from '../utils/pagination.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs/promises';

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isFavourite,
    } = req.query;

    const { contacts, total } = await listContacts(userId, {
      page,
      perPage,
      sortBy,
      sortOrder,
      isFavourite:
        isFavourite === 'true'
          ? true
          : isFavourite === 'false'
          ? false
          : undefined,
    });

    const pagination = calculatePagination({
      page,
      perPage,
      totalItems: total,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        ...pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await getContactByIdService(id, userId);
    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  console.log('🚀 Create Contact - Start');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    const userId = req.user._id;
    let photoUrl = null;

    if (req.file) {
      console.log('📸 Processing file upload');
      try {
        console.log('Uploading to Cloudinary:', req.file.path);
        photoUrl = await uploadImage(req.file.path);
        console.log('Cloudinary URL:', photoUrl);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        throw uploadError;
      } finally {
        console.log('🗑️ Cleaning up temp file:', req.file.path);
        await fs.unlink(req.file.path).catch((error) => {
          console.error('❌ Error deleting temp file:', error);
        });
      }
    }

    const cleanBody = {};
    Object.keys(req.body).forEach((key) => {
      const cleanKey = key.replace(':', '');
      cleanBody[cleanKey] = req.body[key];
    });

    const contactData = {
      ...cleanBody,
      userId,
      photo: photoUrl,
    };

    console.log('📝 Creating contact with data:', contactData);
    const result = await addContact(contactData);
    console.log('✅ Contact created:', result);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('❌ Create Contact Error:', error);
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await removeContact(id, userId);
    res.json({
      status: 'success',
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  console.log('🔄 Update Contact - Start');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Очищаем поля от двоеточий
    const cleanBody = {};
    Object.keys(req.body).forEach((key) => {
      const cleanKey = key.replace(':', '');
      cleanBody[cleanKey] = req.body[key];
    });

    let updateData = { ...cleanBody };

    if (req.file) {
      console.log('📸 Processing file upload');
      try {
        console.log('Uploading to Cloudinary:', req.file.path);
        const photoUrl = await uploadImage(req.file.path);
        console.log('Cloudinary URL:', photoUrl);
        updateData.photo = photoUrl;
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        throw uploadError;
      } finally {
        console.log('🗑️ Cleaning up temp file:', req.file.path);
        await fs.unlink(req.file.path).catch((error) => {
          console.error('❌ Error deleting temp file:', error);
        });
      }
    }

    console.log('📝 Updating contact with data:', updateData);
    const result = await updateContactById(id, updateData, userId);
    console.log('✅ Contact updated:', result);

    res.json({
      status: 'success',
      data: { result },
    });
  } catch (error) {
    console.error('❌ Update Contact Error:', error);
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await updateStatusContactById(id, req.body, userId);
    res.json({
      status: 'success',
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
