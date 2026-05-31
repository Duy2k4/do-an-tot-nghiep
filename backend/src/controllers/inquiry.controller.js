const inquiryService = require('../services/inquiry.service');

async function getInquiries(req, res, next) {
  try {
    res.json(await inquiryService.getInquiries(req.query));
  } catch (error) {
    next(error);
  }
}

async function getMyInquiries(req, res, next) {
  try {
    res.json(await inquiryService.getMyInquiries(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function createInquiry(req, res, next) {
  try {
    res.status(201).json(await inquiryService.createInquiry(req.body, req.user?.id));
  } catch (error) {
    next(error);
  }
}

async function updateInquiry(req, res, next) {
  try {
    res.json(await inquiryService.updateInquiry(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteInquiry(req, res, next) {
  try {
    res.json(await inquiryService.deleteInquiry(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInquiries,
  getMyInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
};
