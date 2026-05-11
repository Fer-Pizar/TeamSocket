
function generarNombreAleatorio() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `Colaborador_${num}`;
}

function configurarModalLogin(supabaseClient) {
    const modal = document.getElementById('login-modal');
    const googleBtn = document.getElementById('modal-google-btn');
    const guestBtn = document.getElementById('modal-guest-btn');
    const nameInput = document.getElementById('guest-name-input');
    const userNameDisplay = document.getElementById('user-name-display');

    if (googleBtn) { 
        googleBtn.onclick = async () => {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
};
    }

    if (guestBtn) {
        guestBtn.onclick = () => {
            let name = nameInput.value.trim();
            if (name === "") name = generarNombreAleatorio();

            window.currentUserDisplayName = name;
            if (userNameDisplay) userNameDisplay.textContent = name + " (Invitado)";
            
            if (modal) modal.classList.add('hidden');
            console.log("Ingresó como invitado:", name);
        };
    }
}