import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(50).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phone: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(50).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
