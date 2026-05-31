const favoriteService = require('../services/favorite.service');

async function getFavorites(req, res, next) {
  try {
    res.json(await favoriteService.getFavorites(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function addFavorite(req, res, next) {
  try {
    res.status(201).json(await favoriteService.addFavorite(req.user.id, req.body.destinationId));
  } catch (error) {
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    res.json(await favoriteService.removeFavorite(req.user.id, req.params.destinationId));
  } catch (error) {
    next(error);
  }
}

async function checkFavorite(req, res, next) {
  try {
    res.json(await favoriteService.checkFavorite(req.user.id, req.params.destinationId));
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
