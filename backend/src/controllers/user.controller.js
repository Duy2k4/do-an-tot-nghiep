const userService = require('../services/user.service');

async function getUsers(req, res, next) {
  try {
    res.json(await userService.getUsers(req.query));
  } catch (error) {
    next(error);
  }
}

async function toggleUserActive(req, res, next) {
  try {
    res.json(await userService.toggleUserActive(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    res.json(await userService.deleteUser(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, toggleUserActive, deleteUser };
