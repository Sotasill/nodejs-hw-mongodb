import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import authenticate from '../middlewares/authenticate.js';
import { uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', uploadMiddleware, createContact);
router.delete('/:id', deleteContact);
router.patch('/:id', uploadMiddleware, updateContact);
router.patch('/:id/favorite', updateStatusContact);

export default router;
