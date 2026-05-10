let supabaseClient;

async function iniciarApp() {
    try {
        const response = await fetch('/config');
        const config = await response.json();
        const { createClient } = supabase;
        supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
        
        const modal = document.getElementById('login-modal');
        const userNameDisplay = document.getElementById('user-name-display');
        
        // Atrapamos los botones
        const openLoginBtn = document.getElementById('open-login-btn');
        const logoutBtn = document.getElementById('logout-btn'); 

        console.log("🔎 Botón de iniciar sesión encontrado:", openLoginBtn);

        // 1. ESCUCHAMOS LOS CAMBIOS DE SESIÓN
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                // LOGUEADO
                const name = session.user.user_metadata?.full_name || session.user.email || "Usuario";
                window.currentUserDisplayName = name;
                if (userNameDisplay) userNameDisplay.textContent = name;
                
                if (modal) modal.classList.add('hidden');
                if (openLoginBtn) openLoginBtn.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'inline-block'; 
            } else {
                // INVITADO O NO LOGUEADO
                if (openLoginBtn) openLoginBtn.style.display = 'inline-block';
                if (logoutBtn) logoutBtn.style.display = 'none'; 

                if (!window.currentUserDisplayName) {
                    if (modal) modal.classList.remove('hidden');
                }
            }
        });

        // 2. CONFIGURAMOS EL MODAL (login.js)
        configurarModalLogin(supabaseClient);

        // 3. LE PONEMOS LA "OREJA" AL BOTÓN DE INICIAR SESIÓN
        if (openLoginBtn) {
            openLoginBtn.addEventListener('click', () => {
                console.log("✅ ¡Clic detectado! Abriendo modal...");
                if (modal) modal.classList.remove('hidden');
            });
        }

        // 4. LE PONEMOS LA "OREJA" AL BOTÓN DE CERRAR SESIÓN
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await supabaseClient.auth.signOut();
                window.currentUserDisplayName = null;
                window.location.reload(); 
            });
        }

    } catch (error) {
        console.error("Error al iniciar:", error);
    }
}

iniciarApp();