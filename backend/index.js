require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const Message = require("./models/Message");
const User = require("./models/User");

// Express App
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.frontendurl], // Allow your frontend explicitly
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    credentials: true, // Allow cookies/headers
  }),
);

// Connect Database
connectDB();

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const folderRoutes = require("./routes/folderRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/resources", resourceRoutes);
// User
app.use("/api/users", userRoutes);


app.use("/api/messages", require("./routes/messages"));
app.use("/api/chat-history", chatRoutes);


app.get("/health", (req, res) => {
  res.status(200).send("ok");
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  // Join user's personal room
  socket.on("join", ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  // Join chat room
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  socket.on("send_message", async ({ sender, receiver, content, roomId }) => {
    if (!sender || !receiver || !content || !roomId) {
      console.warn("Missing required fields in message");
      return;
    }

    console.log("Message received in server:", {
      sender,
      receiver,
      content,
      roomId,
    });

    try {
      // Save message in DB
      const newMessage = new Message({
        sender,
        receiver,
        content,
      });
      await newMessage.save();

      // Fetch sender username
      const senderUser = await User.findById(sender).select("username");

      const msgData = {
        sender,
        senderName: senderUser?.username || "Unknown User",
        receiver,
        content,
        timestamp: newMessage.createdAt,
      };

      // Send notification to receiver
      io.to(receiver).emit("new_chat_message", msgData);

      io.to(roomId).emit("receive_message", msgData);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("messages_seen", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, seen: false },
        { $set: { seen: true } },
      );

      io.to(senderId).emit("messages_seen_by_receiver", {
        senderId,
        receiverId,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
