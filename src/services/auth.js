import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_ACCESS_SECRET = getEnvVar('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvVar('JWT_REFRESH_SECRET');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userData = newUser.toObject();
  delete userData.password;

  return userData;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await User.findByIdAndUpdate(user._id, { token: null });

  const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const sessionId = jwt.sign(
    { id: user._id, type: 'session' },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    },
  );

  await User.findByIdAndUpdate(user._id, {
    token: refreshToken,
    sessionId: sessionId,
  });

  return { accessToken, refreshToken, sessionId };
};

const refreshSession = async (refreshToken) => {
  try {
    const { id } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await User.findById(id);

    if (!user || user.token !== refreshToken) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    await User.findByIdAndUpdate(user._id, { token: null });

    const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    const sessionId = jwt.sign(
      { id: user._id, type: 'session' },
      JWT_REFRESH_SECRET,
      {
        expiresIn: '30d',
      },
    );

    await User.findByIdAndUpdate(user._id, {
      token: newRefreshToken,
      sessionId: sessionId,
    });

    return { accessToken, newRefreshToken, sessionId };
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Invalid refresh token');
    }
    throw error;
  }
};

const logoutUser = async (sessionId) => {
  try {
    const user = await User.findOne({
      sessionId: sessionId,
    });

    if (!user) {
      throw createHttpError(401, 'Not authorized');
    }

    await User.findByIdAndUpdate(user._id, {
      token: null,
      sessionId: null,
    });
  } catch (error) {
    throw error;
  }
};

export { registerUser, loginUser, refreshSession, logoutUser };
