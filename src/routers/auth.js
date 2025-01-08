import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { authenticateLogout } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticateLogout, logout);

export default router;
