const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CONEXIÓN A LA BASE DE DATOS 
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', async (ws) => {
    console.log('Cliente conectado');

    // 1. CARGAR HISTORIAL 
    try {
        const { data: history } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
    
        if (history) {
            ws.send(JSON.stringify({ type: 'history', data: history }));
        }
    } catch (error) {
        console.error("Error al cargar el Historial", err)
    }
    
    ws.on('message', async (message) => {
    let data;
    const rawMessage = message.toString();

    try {
        // Intentamos tratarlo como JSON
        data = JSON.parse(rawMessage);
    } catch (e) {
        // Si falla, es porque es texto plano. Creamos el objeto manualmente.
        console.log("Se recibió texto plano, convirtiendo a objeto...");
        data = { user: "Desconocido", text: rawMessage };
    }

    // Ahora 'data' siempre es un objeto, así que Supabase no fallará
    await supabase.from('messages').insert([
        { sender_name: data.user, content: data.text }
    ]);

    // Broadcast...
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