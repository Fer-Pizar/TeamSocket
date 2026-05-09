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
    const user = document.getElementById('usernameInput').value || "Usuario_Temp";
    
    if (input.value.trim() !== "") {
        const fullMessage = `${user}: ${input.value}`;
        socket.send(fullMessage);
        input.value = '';
    }
}