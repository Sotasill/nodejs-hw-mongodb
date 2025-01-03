const { registerUser } = require('../services/auth');

const register = async (req, res, next) => {
  try {
    const userData = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};
