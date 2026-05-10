const socket = new WebSocket('ws://localhost:3000');

const chatHistory = document.getElementById('messages');

socket.onmessage = (event) => {
    const messageData = event.data;
    
    const messageElement = document.createElement('li');
    
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    
    messageElement.innerHTML = `<strong>${time}</strong> - ${messageData}`;
    
    chatHistory.appendChild(messageElement);

    chatHistory.scrollTop = chatHistory.scrollHeight;
};

function sendMessage() {
    const input = document.getElementById('messageInput');
    const user = window.currentUserDisplayName || "Cargando..."; 
    
    // 🔥 CAMBIO AQUÍ: Usamos 'ws' en lugar de 'socket'
    if (input.value.trim() !== "" && ws.readyState === WebSocket.OPEN) {
        const messageObject = {
            user: user,
            text: input.value
        };
        
        console.log("Enviando mensaje:", messageObject);
        ws.send(JSON.stringify(messageObject)); // 🔥 CAMBIO AQUÍ: Usamos 'ws'
        input.value = '';
    } else {
        console.warn("No se pudo enviar: Socket cerrado o mensaje vacío");
    }
}
function mostrarMensaje(texto, usuario) {
    const item = document.createElement('li');
    item.style.padding = "10px";
    item.style.listStyle = "none";
    item.style.borderBottom = "1px solid #eee";
    
    
    if (usuario === "Sistema") {
        item.innerHTML = `<i style="color: gray;">${texto}</i>`;
    } else {
        item.innerHTML = `<strong style="color: #007bff;">${usuario}:</strong> ${texto}`;
    }
}
