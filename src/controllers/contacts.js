import {
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { ContactsCollection } from '../db/models/contacts.js';
import createError from 'http-errors';
import { calculatePagination } from '../utils/pagination.js';
import { getSortOptions } from '../utils/sorting.js';
import { getFilterOptions } from '../utils/filtering.js';

export const getAllContactsCtrl = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const skip = (page - 1) * perPage;
  const limit = parseInt(perPage);
  const sortOptions = getSortOptions({ sortBy, sortOrder });
  const filterOptions = getFilterOptions({ type, isFavourite });

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find(filterOptions, '-createdAt -updatedAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    ContactsCollection.countDocuments(filterOptions),
  ]);

  const paginationData = calculatePagination({
    page,
    perPage,
    totalItems,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      ...paginationData,
    },
  });
};

export const getContactByIdCtrl = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
});

export const createContactController = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Name, phoneNumber, and contactType are required');
  }

  try {
    const newContact = new ContactsCollection({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: savedContact,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating contact', error: error.message });
  }
});

export const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const updatedContact = await updateContact(contactId, updateData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
});
