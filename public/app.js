
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
    } 
   
    else {
        mostrarMensaje(data.text, data.user);
    }
};

function sendMessage() {
    const texto = messageInput.value.trim();
    let usuario = usernameInput.value.trim();
    
   
    if (usuario === "") {
        usuario = "Usuario_" + Math.floor(Math.random() * 1000);
        usernameInput.value = usuario; 
    }

    if (texto !== '') { 
        const mensaje = { user: usuario, text: texto };
        ws.send(JSON.stringify(mensaje));
        messageInput.value = ''; 
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
    
    messagesArea.appendChild(item);
    messagesArea.scrollTop = messagesArea.scrollHeight; 
}