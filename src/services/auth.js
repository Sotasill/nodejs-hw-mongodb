const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const { User } = require('../db/models/users');

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

module.exports = {
  registerUser,
};
