const chatbotService = require('../services/chatbot.service');

async function sendMessage(req, res, next) {
  try {
    res.json(await chatbotService.sendMessage(req.body, req.user?.id || null));
  } catch (error) {
    console.error('Chatbot error:', error);
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    res.json(await chatbotService.getHistory(req.user.id, req.query));
  } catch (error) {
    next(error);
  }
}

async function getContextPreview(req, res) {
  try {
    res.json(await chatbotService.getContextPreview());
  } catch (error) {
    res.status(500).json({ error: 'Failed to build context' });
  }
}

module.exports = { sendMessage, getHistory, getContextPreview };
