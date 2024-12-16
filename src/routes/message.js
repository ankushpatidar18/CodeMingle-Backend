const express = require("express");
const messageRouter = express.Router();
const Message = require("../models/message"); // Import your Message model
const { userAuth } = require("../middlewares/auth");

// Fetch all messages between two users
messageRouter.get("/:receiverId",userAuth, async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by time

    res.status(200).json({data : messages});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Save a new message
messageRouter.post("/", userAuth, async (req, res) => {
    const { receiverId, text } = req.body; // Extract other fields from the request body
    const senderId = req.user.id; // Assume `userAuth` adds the authenticated user's ID to `req.user`
  
    try {
      const newMessage = new Message({ senderId, receiverId, text });
      const savedMessage = await newMessage.save();
  
      res.status(201).json(savedMessage);
    } catch (err) {
      res.status(500).json({ error: "Failed to send message", details: err.message });
    }
  });
  

module.exports = messageRouter;
