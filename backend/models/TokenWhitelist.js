const mongoose = require('mongoose');

const tokenWhitelistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// automatic cleanup 
tokenWhitelistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

tokenWhitelistSchema.statics.isWhitelisted = async function(token) {
  const tokenDoc = await this.findOne({ token });
  return !!tokenDoc;
};

tokenWhitelistSchema.statics.addToken = async function(token, userId, expiresAt) {
  return await this.create({ token, userId, expiresAt });
};

tokenWhitelistSchema.statics.removeToken = async function(token) {
  return await this.deleteOne({ token });
};

tokenWhitelistSchema.statics.removeAllUserTokens = async function(userId) {
  return await this.deleteMany({ userId });
};

module.exports = mongoose.model('TokenWhitelist', tokenWhitelistSchema);
