// Controller danh mục: điều phối request liên quan danh mục, tỉnh thành và tag.
const categoryService = require('../services/category.service');

// Hàm getDestinationCategories: lấy danh mục điểm đến kèm số lượng điểm đến.
async function getDestinationCategories(req, res, next) {
  try {
    res.json(await categoryService.getDestinationCategories());
  } catch (error) {
    next(error);
  }
}

// Hàm getArticleCategories: lấy danh mục bài viết kèm số lượng bài viết.
async function getArticleCategories(req, res, next) {
  try {
    res.json(await categoryService.getArticleCategories());
  } catch (error) {
    next(error);
  }
}

// Hàm getProvinces: lấy danh sách tỉnh thành, có thể lọc theo vùng.
async function getProvinces(req, res, next) {
  try {
    res.json(await categoryService.getProvinces(req.query.region));
  } catch (error) {
    next(error);
  }
}

// Hàm syncExternalProvinces: đồng bộ tỉnh thành từ API ngoài vào database.
async function syncExternalProvinces(req, res, next) {
  try {
    res.json(await categoryService.syncExternalProvinces());
  } catch (error) {
    next(error);
  }
}

// Hàm getRegions: lấy danh sách vùng miền đang có trong database.
async function getRegions(req, res, next) {
  try {
    res.json(await categoryService.getRegions());
  } catch (error) {
    next(error);
  }
}

// Hàm getTags: lấy danh sách tag kèm số điểm đến sử dụng.
async function getTags(req, res, next) {
  try {
    res.json(await categoryService.getTags());
  } catch (error) {
    next(error);
  }
}

// Hàm createDestinationCategory: admin tạo danh mục điểm đến.
async function createDestinationCategory(req, res, next) {
  try {
    res.status(201).json(await categoryService.createDestinationCategory(req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateDestinationCategory: admin cập nhật danh mục điểm đến.
async function updateDestinationCategory(req, res, next) {
  try {
    res.json(await categoryService.updateDestinationCategory(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteDestinationCategory: admin xóa danh mục điểm đến.
async function deleteDestinationCategory(req, res, next) {
  try {
    res.json(await categoryService.deleteDestinationCategory(req.params.id));
  } catch (error) {
    next(error);
  }
}

// Hàm createArticleCategory: admin tạo danh mục bài viết.
async function createArticleCategory(req, res, next) {
  try {
    res.status(201).json(await categoryService.createArticleCategory(req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateArticleCategory: admin cập nhật danh mục bài viết.
async function updateArticleCategory(req, res, next) {
  try {
    res.json(await categoryService.updateArticleCategory(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteArticleCategory: admin xóa danh mục bài viết.
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

