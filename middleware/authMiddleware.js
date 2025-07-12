const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES } = require('../utils/constants');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null; // Allow guest access
    return next();
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (error) {
    res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }
};

module.exports = authMiddleware;