# BetOne - Plataforma de Apuestas Deportivas

Proyecto universitario de una plataforma de apuestas deportivas en línea con gestión de usuarios, equipos y pronósticos.

## Stack Tecnológico

- **Frontend**: React 19 + Vite + React Router DOM
- **Backend**: Node.js + Express + Sequelize
- **Base de Datos**: SQL Server (MSSQL)
- **Autenticación**: JWT (JSON Web Tokens)

## Requisitos

### Instalación Local
- **Node.js** (v16+)
- **npm**
- **SQL Server 2022** o superior
- Base de datos **PROYECTO** creada (ver `backend/src/config/script.sql`)

## Docker

### Requisitos
- Docker Desktop

### Ejecución

Desde la raíz del proyecto:

```bash
docker compose up --build
```

### Detener Contenedores

```bash
docker compose down
```

## Base de Datos

Ejecuta el script SQL para crear las tablas:

```sql
-- Abre SQL Server Management Studio (SSMS)
-- Abre backend/src/config/script.sql
-- Ejecuta todo el contenido
```

## Autores

Proyecto desarrollado para la Universidad (Ver colaboradores)

## Licencia

Proyecto educativo - Uso interno únicamente.
