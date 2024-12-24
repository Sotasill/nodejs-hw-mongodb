import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email().required(),
  phone: Joi.string().min(3).max(20).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20).email(),
  phone: Joi.string().min(3).max(20),
  favorite: Joi.boolean(),
}).min(1);
