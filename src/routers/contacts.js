import express from 'express';
import { getAllContactsCtrl, getContactByIdCtrl, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsCtrl));

router.get('/:contactId', ctrlWrapper(getContactByIdCtrl));

router.post('/', ctrlWrapper(createContactController));

router.patch('/:contactId', ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
