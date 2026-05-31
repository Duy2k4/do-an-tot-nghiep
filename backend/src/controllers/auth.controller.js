// Controller xác thực: đăng ký, đăng nhập và quản lý hồ sơ người dùng.
const authService = require('../services/auth.service');

// Hàm register: tạo tài khoản mới, mã hóa mật khẩu và trả token đăng nhập.
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

// Hàm login: kiểm tra email/mật khẩu, trạng thái tài khoản và trả token.
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// Hàm getProfile: trả thông tin người dùng đang đăng nhập.
function getProfile(req, res, next) {
  try {
    res.json(authService.getProfile(req.user));
  } catch (error) {
    next(error);
  }
}

// Hàm updateProfile: cập nhật thông tin hồ sơ người dùng hiện tại.
async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// Hàm changePassword: kiểm tra mật khẩu cũ và lưu mật khẩu mới đã mã hóa.
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

