const express = require('express');
const server = express();
const websocket = require('ws');
const servHttp = require('http').createServer(server);

servHttp.listen(3002, () => {
    console.log('Server started on port 3002');
});

const wss = new websocket.Server({ server: servHttp });

let clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    clients.add(ws)

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        for(const client of clients) {
            // if(client !== ws) {
                client.send(message);
            // }
        }
    });

    ws.on('close', () => {
        console.log("A user disconnected");
        clients.delete(ws)
    });
});  

module.exports = server;