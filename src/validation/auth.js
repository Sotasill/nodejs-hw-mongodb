import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required().min(6),
});

export { registerSchema, loginSchema };
