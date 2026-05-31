// Controller yêu cầu tư vấn: nhận yêu cầu người dùng và thao tác quản trị.
const inquiryService = require('../services/inquiry.service');

// Hàm getInquiries: admin lấy danh sách yêu cầu tư vấn có phân trang và lọc.
async function getInquiries(req, res, next) {
  try {
    res.json(await inquiryService.getInquiries(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getMyInquiries: lấy yêu cầu tư vấn của người dùng hiện tại.
async function getMyInquiries(req, res, next) {
  try {
    res.json(await inquiryService.getMyInquiries(req.user.id));
  } catch (error) {
    next(error);
  }
}

// Hàm createInquiry: tạo yêu cầu tư vấn từ form liên hệ.
async function createInquiry(req, res, next) {
  try {
    res.status(201).json(await inquiryService.createInquiry(req.body, req.user?.id));
  } catch (error) {
    next(error);
  }
}

// Hàm updateInquiry: admin cập nhật trạng thái/phản hồi yêu cầu tư vấn.
async function updateInquiry(req, res, next) {
  try {
    res.json(await inquiryService.updateInquiry(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteInquiry: admin xóa yêu cầu tư vấn.
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

