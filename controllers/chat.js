const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { ERROR_MESSAGES } = require('../utils/constants');
const { sendMessageToGemini } = require('../utils/gemini');

/**
 * @swagger
 * /api/chat/sessions:
 *   post:
 *     summary: Create a new chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the chat session (optional)
 *     responses:
 *       201:
 *         description: Chat session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Invalid input
 */
const createSession = async (req, res, next) => {
  try {
    const { title = 'New Chat' } = req.body;
    const session = new ChatSession({
      title,
      userId: req.user?.id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await session.save();

    res.status(201).json({
      session: {
        id: session._id,
        title: session.title,
        userId: session.userId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/chat/sessions:
 *   get:
 *     summary: Get all chat sessions for a user or guest
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user?.id || null });
    res.json(
      sessions.map((session) => ({
        id: session._id,
        title: session.title,
        userId: session.userId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/chat/sessions/{id}:
 *   delete:
 *     summary: Delete a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Chat session deleted
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user?.id || null });
    if (!session) {
      return res.status(404).json({ message: ERROR_MESSAGES.SESSION_NOT_FOUND });
    }
    await Message.deleteMany({ sessionId: session._id });
    await session.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/chat/sessions/{id}/messages:
 *   post:
 *     summary: Send a message in a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message sent and response received
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   sessionId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   role:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *       404:
 *         description: Session not found
 */
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user?.id || null });

    if (!session) {
      return res.status(404).json({ message: ERROR_MESSAGES.SESSION_NOT_FOUND });
    }

    const userMessage = new Message({
      sessionId: session._id,
      content,
      role: 'user',
      timestamp: new Date(),
    });
    await userMessage.save();

    let assistantMessage;
    try {
      const response = await sendMessageToGemini(content);
      assistantMessage = new Message({
        sessionId: session._id,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      });
      await assistantMessage.save();
    } catch (error) {
      assistantMessage = new Message({
        sessionId: session._id,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      });
      await assistantMessage.save();
    }

    // Update session title if it's still 'New Chat'
    if (session.title === 'New Chat') {
      const words = content.split(' ').filter((word) => word.length > 2).slice(0, 3).join(' ');
      session.title = words || 'New Chat';
    }
    session.updatedAt = new Date();
    await session.save();

    res.status(201).json([
      {
        id: userMessage._id,
        sessionId: userMessage.sessionId,
        content: userMessage.content,
        role: userMessage.role,
        timestamp: userMessage.timestamp,
      },
      {
        id: assistantMessage._id,
        sessionId: assistantMessage.sessionId,
        content: assistantMessage.content,
        role: assistantMessage.role,
        timestamp: assistantMessage.timestamp,
      },
    ]);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/chat/sessions/{id}/messages:
 *   get:
 *     summary: Get all messages in a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   sessionId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   role:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *       404:
 *         description: Session not found
 */
const getMessages = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user?.id || null });
    if (!session) {
      return res.status(404).json({ message: ERROR_MESSAGES.SESSION_NOT_FOUND });
    }

    const messages = await Message.find({ sessionId: session._id }).sort({ timestamp: 1 });
    res.json(
      messages.map((message) => ({
        id: message._id,
        sessionId: message.sessionId,
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
      }))
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { createSession, getSessions, deleteSession, sendMessage, getMessages };