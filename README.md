# TeamSocket — Chat Colaborativo en Tiempo Real

Aplicación web colaborativa de mensajería en tiempo real que utiliza el protocolo **WebSocket** para establecer comunicación bidireccional persistente entre clientes y servidor. El sistema permite la interacción simultánea de múltiples usuarios, administración dinámica de conexiones y almacenamiento del historial de mensajes en Supabase.

---

## Características

- Comunicación en tiempo real mediante **WebSocket nativo**
- Autenticación con **Google OAuth** o acceso como **invitado**
- Nombres automáticos asignados a usuarios invitados (`Usuario_123`)
- Notificaciones de entrada y salida de usuarios
- Historial de mensajes cargado desde **Supabase** al conectarse
- Lista de colaboradores conectados en tiempo real
- Temas visuales: **Predeterminado**, **Dark** y **Light**
- Interfaz responsive (SPA) con diseño glassmorphism

---

## Estructura del Proyecto

```
chat-colaborativo-websocket/
│
├── server.js          # Servidor Node.js + Express + WebSocket + Supabase
├── package.json       # Dependencias del proyecto
├── .env               # Variables de entorno (NO subir a GitHub)
├── .gitignore
├── README.md
│
└── public/
    ├── index.html     # Estructura SPA del chat
    ├── style.css      # Estilos visuales y temas
    ├── app.js         # Lógica WebSocket del cliente
    ├── ux.js          # Mejoras de experiencia de usuario
    ├── login.js       # Lógica del modal de login
    ├── auth.js        # Autenticación con Supabase
    ├── login.css      # Estilos del modal de login
    └── assets/
        ├── dark_logo.png
        └── light_logo.png
```

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- Cuenta en [Supabase](https://supabase.com/) con una tabla `messages`
- Credenciales de Supabase (URL y clave pública)

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chat-colaborativo-websocket.git
cd chat-colaborativo-websocket
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instala: **Express**, **ws** (WebSocket), **@supabase/supabase-js** y **dotenv**.

### 3. Crear el archivo `.env`

Crea un archivo llamado `.env` en la **raíz del proyecto** (al mismo nivel que `server.js`):

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-publica-de-supabase
```

> Las credenciales se comparten internamente con el equipo. No las subas a GitHub.

### 4. Iniciar el servidor

```bash
node server.js
```

### 5. Abrir el chat

Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## Configuración de Supabase

La tabla `messages` debe tener la siguiente estructura:

| Columna       | Tipo        | Descripción                    |
|---------------|-------------|-------------------------------|
| `id`          | `int8`      | Clave primaria, autoincremental |
| `sender_name` | `text`      | Nombre del usuario que envió   |
| `content`     | `text`      | Contenido del mensaje          |
| `created_at`  | `timestamp` | Fecha y hora del mensaje       |

---

## Cómo Funciona

```
Cliente (Navegador)          Servidor (Node.js)           Base de Datos (Supabase)
       │                            │                               │
       │── WebSocket connect ──────▶│                               │
       │                            │── Cargar historial ──────────▶│
       │◀─ { type: 'history' } ─────│◀─ [ mensajes ] ───────────────│
       │                            │                               │
       │── { user, text } ─────────▶│                               │
       │                            │── INSERT mensaje ────────────▶│
       │                            │── broadcast a todos ──────────│
       │◀─ { user, text } ──────────│                               │
```

1. El cliente abre una conexión WebSocket persistente con el servidor.
2. El servidor envía el historial de mensajes al cliente recién conectado.
3. Cada mensaje enviado se guarda en Supabase y se retransmite a todos los clientes conectados.
4. Al desconectarse, el servidor notifica a los demás usuarios.

---

## Equipo de Desarrollo

| Integrante | Rol                        | Responsabilidad                                      |
|------------|----------------------------|------------------------------------------------------|
| 1          | Backend Base               | Servidor Node.js + Express + WebSocket               |
| 2          | Eventos WebSocket          | Conexiones, usuarios temporales, broadcast           |
| 3          | Frontend HTML              | Estructura SPA del chat                              |
| 4          | Diseño UI/UX               | Estilos visuales, temas dark/light/pastel            |
| 5          | Cliente JavaScript         | Envío/recepción de mensajes, renderizado dinámico    |
| 6          | Persistencia               | Historial temporal, gestión de usuarios conectados   |
| 7          | Scrum / GitHub / README    | Ramas, PRs, documentación y mejoras UX               |

---

## Tecnologías Utilizadas

| Tecnología         | Uso                                      |
|--------------------|------------------------------------------|
| Node.js            | Entorno de ejecución del servidor        |
| Express            | Servidor HTTP y archivos estáticos       |
| ws                 | Implementación de WebSocket en el server |
| Supabase           | Base de datos e historial de mensajes    |
| HTML5 / CSS3 / JS  | Interfaz de usuario (SPA)                |
| Google OAuth       | Autenticación corporativa                |

---

## Flujo de Ramas (Git)

```
main
 ├── feature/backend-base
 ├── feature/websocket-events
 ├── feature/frontend-html
 ├── feature/ui-ux-design
 ├── feature/client-javascript
 ├── feature/persistence
 └── feature/spa-base-readme-ux   ← rama de este integrante
```

Cada integrante trabaja en su rama y abre un **Pull Request** hacia `main` cuando su tarea está completa.

---

## Notas Adicionales

- El servidor debe estar corriendo para que el chat funcione.
- Si el servidor no está activo, el cliente mostrará "Sin conexión" en la barra superior.
- El tema visual seleccionado se guarda en `localStorage` y persiste entre sesiones.

---

*Proyecto desarrollado para la Actividad 7 — Comunicación en Tiempo Real con WebSocket.*
