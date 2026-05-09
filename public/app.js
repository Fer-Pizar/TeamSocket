const socket = new WebSocket('ws://localhost:3000');

const chatHistory = document.getElementById('messages');

socket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if(messageData.type === 'history') {
        messageData.data.forEach(msg => addMessageList(msg.sender_name, msg.content));
    } else {
        addMessageList(messageData.user, messageData.text);
    }
};

function addMessageList(usuario, mensaje) {
    const messageElement = document.createElement('li');
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    messageElement.innerHTML = `<strong>${time}</strong> - <strong>${usuario}:</strong> ${mensaje}`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
function sendMessage() {
    const input = document.getElementById('messageInput');
    const user = document.getElementById('usernameInput').value || "Usuario_Temp";
    
    if (input.value.trim() !== "") {
        const messageText = {
            user: user,
            text: input.value
        };

        socket.send(JSON.stringify(messageText));
        input.value = '';
    }
}