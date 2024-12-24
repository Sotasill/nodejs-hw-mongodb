import createHttpError from 'http-errors';

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw createHttpError(400, error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateBody;
