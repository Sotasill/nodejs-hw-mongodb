import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';

const listContacts = async (
  userId,
  { page = 1, perPage = 20, sortBy, sortOrder = 'asc', isFavourite } = {},
) => {
  const query = { userId };
  if (isFavourite !== undefined) {
    query.isFavourite = isFavourite;
  }

  const skip = (page - 1) * perPage;
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  const [contacts, total] = await Promise.all([
    ContactsCollection.find(query).sort(sortOptions).skip(skip).limit(perPage),
    ContactsCollection.countDocuments(query),
  ]);

  return {
    contacts,
    total,
  };
};

const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

const addContact = async (data) => {
  const newContact = await ContactsCollection.create(data);
  return newContact;
};

const removeContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

const updateContactById = async (contactId, data, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true },
  );
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

const updateStatusContactById = async (contactId, data, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { isFavourite: data.isFavourite },
    { new: true },
  );
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContactById,
};
