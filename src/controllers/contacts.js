import {
  listContacts,
  getContactById as getContactByIdService,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContactById,
} from '../services/contacts.js';

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, perPage, sortBy, sortOrder } = req.query;
    const contacts = await listContacts(userId, {
      page,
      perPage,
      sortBy,
      sortOrder,
    });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const contact = await getContactByIdService(id, userId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newContact = await addContact({ ...req.body, userId });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const contact = await removeContact(id, userId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const contact = await updateContactById(id, req.body, userId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const contact = await updateStatusContactById(id, req.body, userId);
    res.json(contact);
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
