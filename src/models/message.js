const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Sender's ID
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Recipient's ID
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, 
},{timestamps : true});

module.exports = mongoose.model("Message", MessageSchema);

