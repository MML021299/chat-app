const express = require('express');
const server = express();
const websocket = require('ws');
const servHttp = require('http').createServer(server);

servHttp.listen(3002, () => {
    console.log('Server started on port 3002');
});

const wss = new websocket.Server({ server: servHttp });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send('hello')

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });
});  

module.exports = server;