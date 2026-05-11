/**
 * ux.js — Mejoras de Experiencia de Usuario (UX)
 * TeamSocket | Chat Colaborativo en Tiempo Real
 *
 * Este archivo NO modifica la lógica WebSocket (app.js) ni los estilos (style.css).
 * Solo añade comportamientos de interfaz que mejoran la comodidad del usuario.
 *
 * Mejoras incluidas:
 *  1. Enviar mensaje con tecla Enter
 *  2. Contador de caracteres en el input
 *  3. Indicador visual del estado de conexión WebSocket
 *  4. Scroll automático al último mensaje al abrir el chat
 *  5. Focus automático en el campo de texto
 *  6. Deshabilitar el botón "Enviar" cuando la conexión está caída
 */

document.addEventListener('DOMContentLoaded', () => {

    // Referencias a elementos del DOM
    const messageInput    = document.getElementById('messageInput');
    const sendBtn         = document.getElementById('send-btn');
    const messagesArea    = document.getElementById('messages');
    const charCounter     = document.getElementById('char-counter');
    const statusBadge     = document.getElementById('connection-status');
    const MAX_CHARS       = 300;

    // ─────────────────────────────────────────────────────────
    // 1. ENVIAR MENSAJE CON TECLA ENTER
    //    Llama a sendMessage() definida en app.js al presionar Enter.
    //    Shift+Enter no envía (reservado para salto de línea futuro).
    // ─────────────────────────────────────────────────────────
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(); // función definida en app.js
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    // 2. CONTADOR DE CARACTERES
    //    Actualiza el texto "0/300" debajo del input.
    //    Cambia a rojo cuando el usuario supera el 90% del límite.
    // ─────────────────────────────────────────────────────────
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            const len = messageInput.value.length;
            charCounter.textContent = `${len}/${MAX_CHARS}`;

            // Advertencia visual al acercarse al límite
            charCounter.style.color = len > MAX_CHARS * 0.9
                ? '#ff4b4b'
                : 'rgba(255, 255, 255, 0.45)';
        });
    }

    // ─────────────────────────────────────────────────────────
    // 3. INDICADOR DE ESTADO DE CONEXIÓN WEBSOCKET
    //    Lee el estado del objeto 'ws' declarado en app.js.
    //    Muestra "● Conectado" en verde o "● Sin conexión" en naranja.
    //    También deshabilita el botón de envío si el socket está cerrado.
    // ─────────────────────────────────────────────────────────
    function actualizarEstadoConexion() {
        // 'ws' es la variable global declarada en app.js
        if (typeof ws === 'undefined') return;

        const conectado = ws.readyState === WebSocket.OPEN;

        if (statusBadge) {
            statusBadge.textContent  = conectado ? '● Conectado' : '● Sin conexión';
            statusBadge.style.color  = conectado ? '#00ff88'     : '#ffaa00';
            statusBadge.style.fontSize = '0.75rem';
            statusBadge.style.fontWeight = '600';
            statusBadge.style.marginRight = '10px';
        }

        if (sendBtn) {
            sendBtn.disabled = !conectado;
            sendBtn.style.opacity = conectado ? '1' : '0.5';
            sendBtn.style.cursor  = conectado ? 'pointer' : 'not-allowed';
        }

        if (messageInput) {
            messageInput.placeholder = conectado
                ? 'Escribe un mensaje... (Enter para enviar)'
                : 'Esperando conexión con el servidor...';
        }
    }

    // Verificar estado cada 1.5 segundos
    setInterval(actualizarEstadoConexion, 1500);
    actualizarEstadoConexion(); // ejecución inmediata al cargar

    // ─────────────────────────────────────────────────────────
    // 4. SCROLL AUTOMÁTICO AL ÚLTIMO MENSAJE
    //    Al abrir el chat, baja automáticamente al mensaje más reciente
    //    después de que el historial se haya renderizado.
    // ─────────────────────────────────────────────────────────
    if (messagesArea) {
        // Pequeño delay para esperar que app.js inyecte el historial
        setTimeout(() => {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 800);
    }

    // ─────────────────────────────────────────────────────────
    // 5. FOCUS AUTOMÁTICO EN EL INPUT AL CARGAR
    //    El usuario puede empezar a escribir sin hacer clic.
    // ─────────────────────────────────────────────────────────
    if (messageInput) {
        messageInput.focus();
    }

});
