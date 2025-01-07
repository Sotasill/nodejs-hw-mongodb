import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/users.js';
import jwt from 'jsonwebtoken';
import { getEnvVars } from '../utils/getEnvVars.js';

const JWT_ACCESS_SECRET = getEnvVars('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvVars('JWT_REFRESH_SECRET');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  const userData = newUser.toObject();
  delete userData.password;

  return userData;
};

const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await UsersCollection.findByIdAndUpdate(user._id, { token: null });

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

  await UsersCollection.findByIdAndUpdate(user._id, {
    token: refreshToken,
    sessionId: sessionId,
  });

  return { accessToken, refreshToken, sessionId };
};

const refreshSession = async (refreshToken) => {
  try {
    const { id } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await UsersCollection.findById(id);

    if (!user || user.token !== refreshToken) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    await UsersCollection.findByIdAndUpdate(user._id, { token: null });

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

    await UsersCollection.findByIdAndUpdate(user._id, {
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

const logoutUser = async (userId, sessionId) => {
  try {
    const user = await UsersCollection.findOne({
      _id: userId,
      sessionId: sessionId,
    });

    if (!user) {
      throw createHttpError(401, 'Not authorized');
    }

    await UsersCollection.findByIdAndUpdate(userId, {
      token: null,
      sessionId: null,
    });
  } catch (error) {
    throw error;
  }
};

export { registerUser, loginUser, refreshSession, logoutUser };
