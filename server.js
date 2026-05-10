const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', async (ws) => {
    console.log(' Cliente conectado');

   
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ user: "Sistema", text: " ¡Un nuevo usuario se ha unido al chat!" }));
        }
    });

   
    try {
        const { data: history, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
    
        if (history) {
            ws.send(JSON.stringify({ type: 'history', data: history }));
        }
        if (error) console.error("Error de Supabase:", error);
    } catch (error) {
        console.error("Error al cargar historial:", error);
    }
    
   
    ws.on('message', async (message) => {
        let data;
        try {
            data = JSON.parse(message.toString());
        } catch (e) {
            data = { user: "Desconocido", text: message.toString() };
        }

        await supabase.from('messages').insert([
            { sender_name: data.user, content: data.text }
        ]);

      
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

   
    ws.on('close', () => {
        console.log(' Cliente desconectado');
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ user: "Sistema", text: " Un usuario ha abandonado el chat." }));
            }
        });
    });
});

server.listen(3000, () => {
    console.log(' Servidor en http://localhost:3000');
});