const ws = new WebSocket(`ws://${window.location.host}`);

const messagesArea = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');

ws.onopen = () => console.log(' Conectado al Chat');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'history') {
        data.data.forEach(msg => {
            mostrarMensaje(msg.content, msg.sender_name);
        });
    } else {
        mostrarMensaje(data.text, data.user);
    }
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
