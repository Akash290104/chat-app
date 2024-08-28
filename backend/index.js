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

app.use(cors());
// {
//   origin: "https://talk-a-tivezoneee-78p3xt94d-akashs-projects-6f1d4f45.vercel.app/", // No trailing slash
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Access-Control-Allow-Origin"],
//   credentials: true,
// }
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
        origin: "https://talk-a-tivezoneee-78p3xt94d-akashs-projects-6f1d4f45.vercel.app/", // Ensure this matches your frontend host
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
        console.log("User joined room" + room);
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
  });

app.get("/", async (req, res) => {
  try {
    console.log("Api is running successfully");
    return res.status(200).json({ message: "Api is running successfully" });
  } catch (error) {
    console.log("Api run failure", error);
    return res.status(500).json({ message: error.message });
  }
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Uncomment these if needed
// app.get("/chats", async (req, res) => {
//   try {
//     console.log("Chats sent successfully");
//     return res.status(200).json({ message: "Chats sent successfully", Chats });
//   } catch (error) {
//     console.log("Chats could not be sent", error);
//     return res.status(500).json({ message: error.message });
//   }
// });

// app.get("/api/chats/:id", async (req, res) => {
//   try {
//     const singleChat = Chats.find((c) => c._id === req.params.id);
//     if (!singleChat) {
//       console.log("Chat not found");
//       return res.status(404).json({ message: "Chat not found" });
//     }
//     return res.status(200).json({ message: "Specific chat sent", singleChat });
//   } catch (error) {
//     console.log("Specific chat could not be sent");
//     return res.status(500).json({ message: error.message });
//   }
// });
