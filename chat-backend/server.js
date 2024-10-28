const express = require('express');
const server = express();

const Message = require("./db/messageModel");
const Room = require("./db/roomModel");

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
server.use(cors())

const servHttp = http.createServer(server);

const crypto = require("crypto")

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
  
    socket.on("send_message", async (data) => {
      let roomId = crypto.randomBytes(3*4).toString('base64')

      const existingRoom = await Room.find({ users: {$in: [data.content.userId, data.content.contact._id]} })
      const users = [data.content.userId, data.content.contact._id]

      if (existingRoom && existingRoom.length > 0) {
        roomId = existingRoom.room
      } else {
        const roomData = new Room({
          room: roomId,
          users
        });
  
        roomData.save()
        .then(() => {
          console.log("Room saved to database")
          // console.log(data)
          // socket.to(data.room).emit('receive_message', data.content)
        })
        .catch((err) => {
          console.log(err)
        })
      }

      const messageData = new Message({
        room: roomId,
        author: data.content.author,
        message: data.content.message,
        userId: data.content.userId,
        users,
      });

      messageData.save()
      .then(() => {
        console.log("Message saved to database")
        console.log(data)
        socket.to(data.room).emit('receive_message', data.content)
      })
      .catch((err) => {
        console.log(err)
      })
    });
  
    socket.on("disconnect", () => {
      console.log(`USER ${socket.id} DISCONNECTED`);
    });
  });

servHttp.listen(3002, () => {
  console.log('Server started on port 3002');
});
  
module.exports = server;