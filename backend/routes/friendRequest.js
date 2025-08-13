const express = require("express");
const router = express.Router();

const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// GET /api/friend-request/:userId
router.get("/:userId", async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.params.userId }).populate("from");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch friend requests" });
  }
});

router.post("/", async (req, res) => {
  console.log("Friend request data:", req.body);
  const { from, to } = req.body;

  try {
    const existing = await FriendRequest.findOne({ from, to });
    if (existing) return res.status(400).json({ message: "Already sent" });

    const newRequest = new FriendRequest({ from, to });
    await newRequest.save();

    const sender = await User.findById(from);
    if (!sender) return res.status(404).json({ message: "Sender user not found" });

    const message = `${sender.fname} ${sender.lname} has sent you a friend request`;

    // Upsert friend-request notification to avoid duplicates
    await Notification.findOneAndUpdate(
      { userId: to, from, type: "friend-request" },
      { $set: { message }, $setOnInsert: { read: false } },
      { upsert: true, new: true }
    );

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Friend request error:", err);
    // Handle duplicate friend request race with unique index
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Already sent" });
    }
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// Accept friend request
router.post("/accept", async (req, res) => {
  const { from, to } = req.body;

  try {
    // Try to remove the friend request document
    const request = await FriendRequest.findOneAndDelete({ from, to });

    // Ensure both users exist (optional safeguard)
    const [fromUser, toUser] = await Promise.all([
      User.findById(from).select("_id friends fname lname"),
      User.findById(to).select("_id friends fname lname"),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // If request didn't exist, make operation idempotent by checking if already friends
    const alreadyFriends =
      Array.isArray(fromUser.friends) && fromUser.friends.some((fid) => fid.toString() === toUser._id.toString());

    // Add each user to the other's friends list regardless (addToSet prevents duplicates)
    await Promise.all([
      User.findByIdAndUpdate(fromUser._id, { $addToSet: { friends: toUser._id } }),
      User.findByIdAndUpdate(toUser._id, { $addToSet: { friends: fromUser._id } }),
    ]);

    // Upsert acceptance notification (avoid duplicates)
    try {
      await Notification.findOneAndUpdate(
        { userId: fromUser._id, from: toUser._id, type: "friend-accept" },
        { $set: { message: `${toUser.fname} ${toUser.lname} accepted your friend request` }, $setOnInsert: { read: false } },
        { upsert: true, new: true }
      );
    } catch (notifyErr) {
      console.error("Failed to upsert acceptance notification:", notifyErr);
    }

    // If request was missing but users were already friends, still return success
    if (!request && alreadyFriends) {
      return res.json({ message: "Already friends" });
    }

    return res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Accept friend request error:", err);
    return res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

module.exports = router;
