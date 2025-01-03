const express = require('express');
const { register } = require('../controllers/auth');
const { validateBody } = require('../middlewares/validateBody');
const { registerSchema } = require('../validation/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

module.exports = router;
