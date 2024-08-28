import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connect.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// List of allowed origins
const allowedOrigins = [
  'https://talk-a-tivespherezone-21ao7d8bn-akashs-projects-6f1d4f45.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5000;
let server;

connectDB()
  .then(() => {
    // Initialize and start the Express server
    server = app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });

    // Create a new Socket.IO server and attach it to the HTTP server
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: allowedOrigins, // Ensure this matches your frontend host
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      },
    });

    // Set up event listeners for Socket.IO
    io.on("connection", (socket) => {
      console.log("Connected to socket.io", socket.id);

      socket.on("setup", (userData) => {
        socket.join(userData.data.existingUser._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room " + room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) {
          return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
          if (user._id === newMessageReceived.sender._id) return;

          socket.in(user._id).emit("message received", newMessageReceived);
        });
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected");
        // Handle user disconnection here
      });

      // Add your socket event listeners here
    });
  })
  .catch((error) => {
    console.log("Could not connect to MongoDB", error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Base API route
app.get("/", async (req, res) => {
  try {
    console.log("Api is running successfully");
    return res.status(200).json({ message: "Api is running successfully" });
  } catch (error) {
    console.log("Api run failure", error);
    return res.status(500).json({ message: error.message });
  }
});

// Mount the routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
