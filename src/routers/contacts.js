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

const router = express.Router();


router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', validateBody(createContactSchema), createContact);
router.delete('/:id', deleteContact);
router.put('/:id', validateBody(updateContactSchema), updateContact);
router.patch('/:id/favorite', updateStatusContact);

export default router;
