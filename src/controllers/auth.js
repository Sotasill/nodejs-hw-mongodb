import { registerUser } from '../services/auth.js';
import { loginUser, refreshSession, logoutUser } from '../services/auth.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.js';
import { sendResetPasswordEmail } from '../utils/sendMail.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const register = async (req, res, next) => {
  try {
    const userData = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: userData.name,
        email: userData.email,
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

    const { accessToken, refreshToken, sessionId } = await loginUser({
      email,
      password,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.cookie('sid', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
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

    const { accessToken, newRefreshToken, sessionId } = await refreshSession(
      refreshToken,
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.cookie('sid', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
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
    const { sid } = req.cookies;
    if (!sid) {
      throw createHttpError(401, 'Not authorized');
    }

    await logoutUser(sid);

    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('sid', { path: '/' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  try {
    await sendResetPasswordEmail(email, resetToken);
    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

const wrappedSendResetEmail = ctrlWrapper(sendResetEmail);

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    user.password = password;
    await user.save();

    // Удаляем текущую сессию пользователя
    await user.updateOne({ $set: { session: null } });

    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};

const wrappedResetPassword = ctrlWrapper(resetPassword);

export {
  register,
  login,
  refresh,
  logout,
  wrappedSendResetEmail as sendResetEmail,
  wrappedResetPassword as resetPassword,
};
