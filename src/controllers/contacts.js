import { getAllContacts, getContactById, updateContact, deleteContact } from '../services/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { ContactsCollection } from '../db/models/contacts.js';
import createError from 'http-errors';

export const getAllContactsCtrl = ctrlWrapper(async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 'success',
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

export const getContactByIdCtrl = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully found contact!',
    data: contact,
  });
});

export const createContactController = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Name, phoneNumber, and contactType are required");
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
      message: "Successfully created a contact!",
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
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
    message: "Successfully patched a contact!",
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
