const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();

const connectToDataBase = require("./src/config/db.config");
const userRouter = require("./src/router/userrouter");
const chatRouter = require("./src/router/chatrouter");
const messageRouter = require("./src/router/messagerouter");

const port = process.env.PORT;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Corrected URL for your React app
  credentials: true // If you're using cookies or other credentials in your requests
}));

app.use(express.json());
connectToDataBase();

app.use(userRouter);
app.use("/user/chat", chatRouter);
app.use("/user/message", messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Corrected URL for your React app
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("inside the connection");

  socket.on("setup", (userData) => {
    socket.join(userData.user_id);
    console.log(userData.user_id, "iddddd");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room :" + room);
  });

  socket.on("typing",(room)=>socket.in(room).emit("typing"))
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat?.users) return console.log("chat user not defined");

    chat.users.forEach(user => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
  socket.off("setup",()=>{
    socket.leave(userData.user_id)
  })
});

server.listen(port, () => {
  console.log(`SERVER IS RUNNING, ${port}`);
});
