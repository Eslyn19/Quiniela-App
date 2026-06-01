# BetOne - Plataforma de Apuestas Deportivas

Proyecto universitario de una plataforma de apuestas deportivas en línea con gestión de usuarios, equipos y pronósticos.

## Stack Tecnológico

- **Frontend**: React 19 + Vite + React Router DOM
- **Backend**: Node.js + Express + Sequelize
- **Base de Datos**: SQL Server (MSSQL)
- **Autenticación**: JWT (JSON Web Tokens)

## Requisitos

- Node.js (v16+)
- npm
- SQL Server 2022 o superior
- Base de datos PROYECTO creada (ver `backend/src/config/script.sql`)

## Instalación

### 1. Frontend
```bash
cd frontend
npm install
```

### 2. Backend
```bash
cd backend
npm install
```

### 3. Variables de Entorno (Backend)

Crea un archivo `.env` en la carpeta `backend/`:

```env
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=PROYECTO
DB_USER=sa
DB_PASSWORD=pass_sql_server
JWT_SECRET=pass_jwt
SERVER_PORT=3000
```

## Ejecución

### Modo Desarrollo

**Frontend** (en carpeta `frontend/`):
```bash
npm run dev
```
Accede a `http://localhost:5173`

**Backend** (en carpeta `backend/`, en otra terminal):
```bash
npm run dev
```
El servidor estará en `http://localhost:3000`

### Build Producción

**Frontend**:
```bash
npm run build
```

**Backend**: No requiere build (Node.js corre directamente los archivos `.js`)

## Características

- ✅ Registro y login de usuarios con autenticación JWT
- ✅ Panel de administración (gestión de usuarios, equipos, apuestas)
- ✅ Crear tipos de puntuación para apuestas
- ✅ Toggle de contraseña en login/registro
- ✅ Diseño responsive con tema dark cosmos

## Estructura del Proyecto

```
ProyectoBases/
├── frontend/
│   ├── src/
│   │   ├── pages/      (Login, Register, Admin, Home)
│   │   ├── components/ (Header, Footer, Dock, etc.)
│   │   └── assets/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/       (Sequelize models)
│   │   ├── routes/       (Express routes)
│   │   ├── controllers/  (Lógica de negocio)
│   │   ├── middlewares/  (Auth, validaciones)
│   │   └── config/       (Database, script.sql)
│   └── package.json
└── README.md
```

## Base de Datos

Ejecuta el script SQL para crear las tablas:

```sql
-- Abre SQL Server Management Studio (SSMS)
-- Abre backend/src/config/script.sql
-- Ejecuta todo el contenido
```

## Rutas Principales

### Frontend
- `/` - Home/Landing
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/Admin` - Panel de administración (requiere token + rol ADMIN)

### Backend API
- `POST /api/registro/register` - Registrar usuario
- `POST /api/registro/login` - Iniciar sesión
- `GET /api/admin/verify` - Verificar token de admin
- `GET /api/admin/usuarios` - Listar usuarios
- `PATCH /api/admin/usuarios/:id/estado` - Cambiar estado de usuario
- `GET/POST/DELETE /api/admin/equipos` - CRUD de equipos
- `GET/POST/DELETE /api/admin/puntuaciones` - CRUD de tipos de puntuación
- `GET/POST/DELETE /api/admin/apuestas` - CRUD de apuestas

## Autores

Proyecto desarrollado para la Universidad.

## Licencia

Proyecto educativo - Uso interno únicamente.
