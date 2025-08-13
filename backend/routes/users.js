const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// GET all users except current user, and exclude already-friends
router.get("/", async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId; // Pass from frontend as query param

    if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ error: "Invalid or missing currentUserId" });
    }

    const currentUser = await User.findById(currentUserId).select("friends").lean();
    const currentFriends = currentUser?.friends || [];

    const users = await User.find(
      {
        _id: { $ne: currentUserId, $nin: currentFriends }
      },
      { password: 0 }
    ).lean();

    res.json(users);
  } catch (err) {
    console.error("/api/users error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET current user's friends without populate
router.get("/friends", async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId;

    if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ error: "Invalid or missing currentUserId" });
    }

    const userDoc = await User.findById(currentUserId).select("friends").lean();
    if (!userDoc) return res.json([]);

    const friendIds = Array.isArray(userDoc.friends) ? userDoc.friends : [];
    if (friendIds.length === 0) return res.json([]);

    const friends = await User.find(
      { _id: { $in: friendIds } },
      { password: 0 }
    ).lean();

    res.json(friends);
  } catch (err) {
    console.error("/api/users/friends error:", err);
    res.status(500).json({ error: "Failed to fetch friends", details: err.message });
  }
});

module.exports = router;
