const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Sender's ID
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Recipient's ID
  text: { type: String, required: true }, // Message text
  timestamp: { type: Date, default: Date.now }, // When the message was sent
},{timestamps : true});

module.exports = mongoose.model("Message", MessageSchema);

