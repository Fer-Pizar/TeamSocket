const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    console.log('Nuevo usuario conectado');

    ws.on('message', (data) => {
        const messagePayload = data.toString();
        
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messagePayload);
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});