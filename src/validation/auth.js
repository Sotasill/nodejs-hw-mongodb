import { emailRegexp } from '../constants/users.js';

const Joi = require('joi');


const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
}; 