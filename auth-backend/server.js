const express = require('express');
const server = express();
const servHttp = require('http').createServer(server);

// const { Server } = require('socket.io')
const io = require('socket.io')(servHttp);
let users = {};

servHttp.listen(3002, () => {
    console.log('Server started on port 3002');
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("login", (data) => {
      console.log("user: " + data.userId + " connected");
      // saving userId to array with socket ID
      users[socket.id] = data.userId;
    });
  
    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");
    });
  });
module.exports = server;