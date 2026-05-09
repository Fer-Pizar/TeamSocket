const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Esto lee el archivo .env

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CONEXIÓN A LA BASE DE DATOS
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', async (ws) => {
    console.log('Cliente conectado');

    // 1. Al conectarse, enviamos el historial de la tabla que creaste
    const { data: history } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (history) {
        ws.send(JSON.stringify({ type: 'history', data: history }));
    }

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        
        // 2. GUARDAR EN LA BASE DE DATOS
        // Usamos los nombres de columna que pusiste en el SQL Query
        await supabase.from('messages').insert([
            { sender_name: data.user, content: data.text }
        ]);

        // 3. REENVIAR A TODOS (Broadcast)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => console.log('Cliente desconectado'));
});

server.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});