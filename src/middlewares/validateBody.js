const createHttpError = require('http-errors');

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validateAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      next(createHttpError(400, error.message));
    }
  };
};

module.exports = {
  validateBody,
};
