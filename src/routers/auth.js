import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { authenticateLogout } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { resetEmailSchema, resetPasswordSchema } from '../validation/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticateLogout, logout);
router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  sendResetEmail,
);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;
