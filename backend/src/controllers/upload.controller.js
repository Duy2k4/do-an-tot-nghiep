const uploadService = require('../services/upload.service');

function uploadImage(req, res, next) {
  try {
    res.json(uploadService.buildSingleImageResponse(req, req.file));
  } catch (error) {
    next(error);
  }
}

function uploadImages(req, res, next) {
  try {
    res.json(uploadService.buildMultipleImagesResponse(req, req.files));
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadImage, uploadImages };
