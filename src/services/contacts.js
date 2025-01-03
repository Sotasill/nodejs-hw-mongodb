import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';

const listContacts = async (userId) => {
  const contacts = await ContactsCollection.find({ userId });
  return contacts;
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
    { favorite: data.favorite },
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
