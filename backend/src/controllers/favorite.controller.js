// Controller yêu thích: quản lý danh sách điểm đến yêu thích của người dùng.
const favoriteService = require('../services/favorite.service');

// Hàm getFavorites: lấy danh sách điểm đến yêu thích của người dùng.
async function getFavorites(req, res, next) {
  try {
    res.json(await favoriteService.getFavorites(req.user.id));
  } catch (error) {
    next(error);
  }
}

// Hàm addFavorite: thêm điểm đến vào danh sách yêu thích nếu chưa tồn tại.
async function addFavorite(req, res, next) {
  try {
    res.status(201).json(await favoriteService.addFavorite(req.user.id, req.body.destinationId));
  } catch (error) {
    next(error);
  }
}

// Hàm removeFavorite: xóa điểm đến khỏi danh sách yêu thích.
async function removeFavorite(req, res, next) {
  try {
    res.json(await favoriteService.removeFavorite(req.user.id, req.params.destinationId));
  } catch (error) {
    next(error);
  }
}

// Hàm checkFavorite: kiểm tra điểm đến đã được yêu thích hay chưa.
async function checkFavorite(req, res, next) {
  try {
    res.json(await favoriteService.checkFavorite(req.user.id, req.params.destinationId));
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };

