const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

function getProfile(req, res, next) {
  try {
    res.json(authService.getProfile(req.user));
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
