// Controller chatbot: nhận tin nhắn, lịch sử và context preview cho AI.
const chatbotService = require('../services/chatbot.service');

// Hàm sendMessage: lưu tin nhắn, gọi AI, trích xuất card và lưu phản hồi.
async function sendMessage(req, res, next) {
  try {
    res.json(await chatbotService.sendMessage(req.body, req.user?.id || null));
  } catch (error) {
    console.error('Chatbot error:', error);
    next(error);
  }
}

// Hàm getHistory: lấy lịch sử chatbot của người dùng hiện tại.
async function getHistory(req, res, next) {
  try {
    res.json(await chatbotService.getHistory(req.user.id, req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getContextPreview: trả bản xem trước context chatbot để kiểm tra nhanh.
async function getContextPreview(req, res) {
  try {
    res.json(await chatbotService.getContextPreview());
  } catch (error) {
    res.status(500).json({ error: 'Failed to build context' });
  }
}

module.exports = { sendMessage, getHistory, getContextPreview };

