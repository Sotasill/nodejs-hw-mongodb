import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

export default router;
