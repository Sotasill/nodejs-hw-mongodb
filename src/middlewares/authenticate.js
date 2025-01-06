import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { getEnvVars } from '../utils/getEnvVars.js';

const JWT_ACCESS_SECRET = getEnvVars('JWT_ACCESS_SECRET');

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Not authorized');
    }

    try {
      const { id } = jwt.verify(token, JWT_ACCESS_SECRET);
      const user = await UsersCollection.findOne({ _id: id });

      if (!user || !user.token) {
        throw createHttpError(401, 'Not authorized');
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Not authorized');
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;
