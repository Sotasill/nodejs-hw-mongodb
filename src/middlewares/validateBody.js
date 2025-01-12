import { createHttpError } from '../helpers/HttpError.js';

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return next(createHttpError(400, error.message));
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  return func;
};
