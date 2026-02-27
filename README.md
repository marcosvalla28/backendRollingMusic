# 🎵 Rolling Music - Backend

API REST desarrollada en Node.js para la plataforma **Rolling Music**, una aplicación de música que permite gestionar artistas, álbumes, canciones y usuarios.

---

## 🚀 Tecnologías utilizadas

- **Node.js** — Entorno de ejecución
- **Express.js** — Framework para la API REST
- **MongoDB + Mongoose** — Base de datos NoSQL
- **JSON Web Token (JWT)** — Autenticación y autorización
- **Bcrypt** — Encriptación de contraseñas
- **Dotenv** — Gestión de variables de entorno

---

## 📁 Estructura del proyecto

```
backendRollingMusic/
├── src/
│   ├── config/         # Configuración de la base de datos
│   ├── controllers/    # Lógica de negocio por recurso
│   ├── middlewares/    # Middlewares de autenticación y validación
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definición de rutas
│   └── index.js        # Punto de entrada de la aplicación
├── .env.example        # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/marcosvalla28/backendRollingMusic.git
cd backendRollingMusic
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Editá el archivo `.env` con tus propias credenciales:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/rollingMusic
JWT_SECRET=tu_secreto_jwt
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:4000`

---

## 📡 Endpoints principales

### 🔐 Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registro de nuevo usuario |
| `POST` | `/api/auth/login` | Inicio de sesión |

### 👤 Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `GET` | `/api/users/:id` | Obtener usuario por ID |
| `PUT` | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

### 🎤 Artistas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/artists` | Obtener todos los artistas |
| `GET` | `/api/artists/:id` | Obtener artista por ID |
| `POST` | `/api/artists` | Crear artista *(requiere auth)* |
| `PUT` | `/api/artists/:id` | Actualizar artista *(requiere auth)* |
| `DELETE` | `/api/artists/:id` | Eliminar artista *(requiere auth)* |

### 🎵 Canciones / Álbumes

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/songs` | Obtener todas las canciones |
| `GET` | `/api/songs/:id` | Obtener canción por ID |
| `POST` | `/api/songs` | Crear canción *(requiere auth)* |
| `PUT` | `/api/songs/:id` | Actualizar canción *(requiere auth)* |
| `DELETE` | `/api/songs/:id` | Eliminar canción *(requiere auth)* |

> **Nota:** Los endpoints protegidos requieren enviar el token JWT en el header:
> ```
> Authorization: Bearer <token>
> ```

---

## 👥 Equipo

Desarrollado por el equipo de **Rolling Music** como proyecto integrador de Rolling Code School.

---

## 📄 Licencia

Este proyecto es de uso educativo. Todos los derechos reservados © 2024 Rolling Music Team.
