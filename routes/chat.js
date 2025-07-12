const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../middleware/authMiddleware');
const { createSession, getSessions, deleteSession, sendMessage, getMessages } = require('../controllers/chat');
const validate = require('../middleware/validate');

const messageSchema = Joi.object({
  content: Joi.string().required().min(1),
});

router.post('/sessions', authMiddleware, createSession);
router.get('/sessions', authMiddleware, getSessions);
router.delete('/sessions/:id', authMiddleware, deleteSession);
router.post('/sessions/:id/messages', authMiddleware, validate(messageSchema), sendMessage);
router.get('/sessions/:id/messages', authMiddleware, getMessages);

module.exports = router;