const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("TokenBlackList", tokenBlackListSchema);
