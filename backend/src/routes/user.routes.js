// Route người dùng: admin xem, khóa/mở khóa và xóa tài khoản.
const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, requireAdmin, userController.getUsers);
router.put('/:id/toggle-active', authenticate, requireAdmin, userController.toggleUserActive);
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

module.exports = router;

