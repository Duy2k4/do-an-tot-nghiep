// Controller người dùng: các thao tác quản trị tài khoản.
const userService = require('../services/user.service');

// Hàm getUsers: admin lấy danh sách người dùng có phân trang và tìm kiếm.
async function getUsers(req, res, next) {
  try {
    res.json(await userService.getUsers(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm toggleUserActive: admin khóa hoặc mở khóa tài khoản người dùng.
async function toggleUserActive(req, res, next) {
  try {
    res.json(await userService.toggleUserActive(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteUser: admin xóa người dùng, không cho tự xóa chính mình.
async function deleteUser(req, res, next) {
  try {
    res.json(await userService.deleteUser(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, toggleUserActive, deleteUser };

