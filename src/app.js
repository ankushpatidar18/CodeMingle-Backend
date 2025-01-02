const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies/auth headers
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Set up HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track connected users
const users = {};

// Socket.IO Real-Time Communication
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins with their ID
  socket.on("join", (userId) => {
    if (!users[userId]) users[userId] = [];
    users[userId].push(socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {

      // Notify the receiver
      if (users[receiverId]) {
        users[receiverId].forEach((receiverSocket) => {
          io.to(receiverSocket).emit("receiveMessage", { senderId, text });
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const userId in users) {
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }
  });
});


const PORT = process.env.PORT || 8080;

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRoute");
const messageRouter = require("./routes/message");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/messages", messageRouter);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err.message));
