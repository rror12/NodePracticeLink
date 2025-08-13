const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// Prevent duplicate friend requests between the same users
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
