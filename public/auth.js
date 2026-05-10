let supabaseClient;

async function iniciarApp() {
    try {
        const response = await fetch('/config');
        const config = await response.json();
        const { createClient } = supabase;
        supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);

        // Este bloque es el que "limpia" la interfaz automáticamente
        supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Estado de Auth cambiado:", event, session); // Para ver qué pasa

    if (session && session.user) {
        // 🔥 TRUCO: Si no hay full_name, usamos el correo, y si no, "Usuario"
        const name = session.user.user_metadata?.full_name || session.user.email || "Usuario Logueado";
        
        window.currentUserDisplayName = name;
        document.getElementById('user-name-display').textContent = name;
        document.getElementById('google-login-btn').style.display = 'none';
    } else {
        if (!window.currentUserDisplayName) {
            window.currentUserDisplayName = generarNombreAleatorio();
        }
        document.getElementById('user-name-display').textContent = window.currentUserDisplayName + " (Invitado)";
        document.getElementById('google-login-btn').style.display = 'block';
    }
});

        setupLoginButton();
    } catch (error) {
        console.error("Error:", error);
    }
}
function setupLoginButton() {
    const btn = document.getElementById('google-login-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
        });
    }
}
function generarNombreAleatorio() {
    const numero = Math.floor(1000 + Math.random() * 9000);
    return `Colaborador_${numero}`;
}
// --- AQUÍ ESTÁ TU FUNCIÓN CHECKUSER ---
async function checkUser() {
    // Forzamos a Supabase a buscar la sesión actual en el almacenamiento local
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    const userNameDisplay = document.getElementById('user-name-display');
    const loginBtn = document.getElementById('google-login-btn');

    if (session && session.user) {
        // LOGIN EXITOSO
        const userFullName = session.user.user_metadata.full_name || session.user.email;
        if (userNameDisplay) userNameDisplay.textContent = userFullName;
        if (loginBtn) loginBtn.style.display = 'none';
        
        window.currentUserDisplayName = userFullName;
        console.log("👤 Sesión recuperada:", userFullName);
    } else {
        // NO HAY LOGIN -> ASIGNAR RANDOM
        const nombreRandom = generarNombreAleatorio();
        window.currentUserDisplayName = nombreRandom;
        
        if (userNameDisplay) userNameDisplay.textContent = nombreRandom + " (Invitado)";
        if (loginBtn) loginBtn.style.display = 'block';
        
        console.log("ℹ️ Usando nombre aleatorio:", nombreRandom);
    }
}

iniciarApp();