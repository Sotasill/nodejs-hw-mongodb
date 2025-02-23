import { registerUser } from '../services/auth.js';
import { loginUser, refreshSession, logoutUser } from '../services/auth.js';
import createHttpError from 'http-errors';

const register = async (req, res, next) => {
  try {
    const userData = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        user: {
          name: userData.name,
          email: userData.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const { accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Not authorized');
    }

    await logoutUser(refreshToken);
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 200,
      message: 'Successfully logged out!',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, refresh, logout };
