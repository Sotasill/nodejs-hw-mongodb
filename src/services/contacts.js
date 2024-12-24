import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find().select('-__v');
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId).select('-__v');
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = new ContactsCollection(contactData);
  const savedContact = await newContact.save();
  return savedContact.toObject({ versionKey: false });
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(contactId).select('-__v');
  return deletedContact;
};

export const updateContact = async (contactId, updateData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(contactId, updateData, { new: true }).select('-__v');
  return updatedContact;
};
