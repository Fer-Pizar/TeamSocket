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
    
    if (input.value.trim() !== "" && ws.readyState === WebSocket.OPEN) {
        const messageObject = {
            user: user,
            text: input.value
        };
        
        console.log("Enviando mensaje:", messageObject);
        ws.send(JSON.stringify(messageObject)); 
        input.value = '';
    } else {
        console.warn("No se pudo enviar: Socket cerrado o mensaje vacío");
    }
}
function mostrarMensaje(texto, usuario) {
    const item = document.createElement('li');
    item.style.padding = "10px";
    item.style.listStyle = "none";
    //item.style.borderBottom = "1px solid #eee";
    
    
    if (usuario === "Sistema") {
        item.innerHTML = `<i style="color: gray;">${texto}</i>`;
    } else {
        item.innerHTML = `<strong style="color: #007bff;">${usuario}:</strong> ${texto}`;
    }
    messagesArea.appendChild(item);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

const themeSelect = document.getElementById('themeSelect');
const themeLogo = document.getElementById('themeLogo');

function applyTheme(theme) {
    document.body.classList.remove('theme-default', 'theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);

    if (theme === 'light') {
        themeLogo.src = 'assets/light_logo.png';
    } else {
        themeLogo.src = 'assets/dark_logo.png';
    }

    localStorage.setItem('teamsocket-theme', theme);
}

const savedTheme = localStorage.getItem('teamsocket-theme') || 'default';

applyTheme(savedTheme);
themeSelect.value = savedTheme;

themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
});