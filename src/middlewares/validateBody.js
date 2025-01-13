import { createHttpError } from '../helpers/HttpError.js';

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      console.log('Validating body:', req.body);
      const { error } = schema.validate(req.body);
      if (error) {
        console.log('Validation error:', error.details);
        return next(createHttpError(400, error.message));
      }
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      next(error);
    }
  };

  return func;
};
