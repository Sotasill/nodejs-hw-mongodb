import Joi from 'joi';
import { validateBody } from '../middlewares/validateBody.js';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(3).email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(3).email().required(),
  password: Joi.string().min(6).required(),
});

export const validateRegisterBody = validateBody(registerSchema);
export const validateLoginBody = validateBody(loginSchema);
