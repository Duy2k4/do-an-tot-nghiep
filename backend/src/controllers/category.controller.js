const categoryService = require('../services/category.service');

async function getDestinationCategories(req, res, next) {
  try {
    res.json(await categoryService.getDestinationCategories());
  } catch (error) {
    next(error);
  }
}

async function getArticleCategories(req, res, next) {
  try {
    res.json(await categoryService.getArticleCategories());
  } catch (error) {
    next(error);
  }
}

async function getProvinces(req, res, next) {
  try {
    res.json(await categoryService.getProvinces(req.query.region));
  } catch (error) {
    next(error);
  }
}

async function syncExternalProvinces(req, res, next) {
  try {
    res.json(await categoryService.syncExternalProvinces());
  } catch (error) {
    next(error);
  }
}

async function getRegions(req, res, next) {
  try {
    res.json(await categoryService.getRegions());
  } catch (error) {
    next(error);
  }
}

async function getTags(req, res, next) {
  try {
    res.json(await categoryService.getTags());
  } catch (error) {
    next(error);
  }
}

async function createDestinationCategory(req, res, next) {
  try {
    res.status(201).json(await categoryService.createDestinationCategory(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateDestinationCategory(req, res, next) {
  try {
    res.json(await categoryService.updateDestinationCategory(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteDestinationCategory(req, res, next) {
  try {
    res.json(await categoryService.deleteDestinationCategory(req.params.id));
  } catch (error) {
    next(error);
  }
}

async function createArticleCategory(req, res, next) {
  try {
    res.status(201).json(await categoryService.createArticleCategory(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateArticleCategory(req, res, next) {
  try {
    res.json(await categoryService.updateArticleCategory(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteArticleCategory(req, res, next) {
  try {
    res.json(await categoryService.deleteArticleCategory(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDestinationCategories,
  getArticleCategories,
  getProvinces,
  syncExternalProvinces,
  getRegions,
  getTags,
  createDestinationCategory,
  updateDestinationCategory,
  deleteDestinationCategory,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
};
