const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'New Chat', trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);