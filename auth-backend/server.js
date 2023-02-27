const express = require('express');
const server = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
server.use(cors())

const servHttp = http.createServer(server);

let users = {};

const io = new Server(servHttp, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("login", (data) => {
      console.log("user: " + data.userId + " connected");
      // saving userId to array with socket ID
      users[socket.id] = data.userId;
    });

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(data)
      console.log(`User ${socket.id} Joined Room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      console.log(data)
      socket.to(data.room).emit('receive_message', data.content)
    });
  
    socket.on("disconnect", () => {
      console.log(`USER ${socket.id} DISCONNECTED`);
    });
  });

servHttp.listen(3002, () => {
  console.log('Server started on port 3002');
});
  
module.exports = server;