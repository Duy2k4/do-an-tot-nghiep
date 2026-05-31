function getPublicUploadUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

function buildSingleImageResponse(req, file) {
  if (!file) {
    const error = new Error('No file uploaded');
    error.status = 400;
    throw error;
  }

  return {
    url: getPublicUploadUrl(req, file.filename),
    filename: file.filename,
    originalName: file.originalname,
  };
}

function buildMultipleImagesResponse(req, files) {
  if (!files || files.length === 0) {
    const error = new Error('No files uploaded');
    error.status = 400;
    throw error;
  }

  return files.map(file => ({
    url: getPublicUploadUrl(req, file.filename),
    filename: file.filename,
    originalName: file.originalname,
  }));
}

module.exports = { buildSingleImageResponse, buildMultipleImagesResponse };
