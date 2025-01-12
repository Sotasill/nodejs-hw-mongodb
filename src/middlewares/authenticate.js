import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_ACCESS_SECRET = getEnvVar('JWT_ACCESS_SECRET');

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Not authorized');
    }

    try {
      const { id } = jwt.verify(token, JWT_ACCESS_SECRET);
      const user = await User.findById(id);

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

const authenticateLogout = async (req, res, next) => {
  try {
    const { sid } = req.cookies;
    if (!sid) {
      throw createHttpError(401, 'Not authorized');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { authenticate as default, authenticateLogout };
