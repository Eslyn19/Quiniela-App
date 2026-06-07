import express from 'express';
import cors from "cors";
import path from 'path';

import { fileURLToPath } from 'url';
import { verifyToken } from './src/middlewares/AuthToken.js';
import { isAdmin, isPlayer } from './src/middlewares/RoleGuard.js';
import { obtenerRankingGlobal } from './src/controllers/playerController/ApuestasJugadorController.js';

import playerRoutes from './src/routes/playerRoutes/Jugador.routes.js';
import playerApuestasRoutes from './src/routes/playerRoutes/Apuestas.routes.js';
import playerEquiposRoutes from './src/routes/playerRoutes/Equipos.routes.js';
import authRoutes from './src/routes/authRoutes/Auth.routes.js';
import adminRoutes from './src/routes/adminRoutes/Admin.routes.js';
import equiposRoutes from './src/routes/adminRoutes/Equipos.routes.js';
import apuestasRoutes from './src/routes/adminRoutes/Apuestas.routes.js';
import catalogoRoutes from './src/routes/adminRoutes/Catalogo.routes.js';
import puntuacionRoutes from './src/routes/adminRoutes/Puntuacion.routes.js';
import entidadRoutes from './src/routes/adminRoutes/Entidad.routes.js';
import resultadoRoutes from './src/routes/adminRoutes/Resultado.routes.js';
import adminPremiosRoutes from './src/routes/adminRoutes/Premios.routes.js';
import uploadRoutes from './src/routes/adminRoutes/Upload.routes.js';
import playerPremiosRoutes from './src/routes/playerRoutes/Premios.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/registro', authRoutes);
app.get('/api/public/ranking-global', obtenerRankingGlobal);

app.use('/api/admin', 
  verifyToken, 
  isAdmin,
  adminRoutes, 
  equiposRoutes, 
  apuestasRoutes,
  catalogoRoutes, 
  puntuacionRoutes, 
  entidadRoutes,
  resultadoRoutes, 
  adminPremiosRoutes, 
  uploadRoutes
);

app.use('/api/player', 
  verifyToken, 
  isPlayer,
  playerRoutes, 
  playerApuestasRoutes, 
  playerEquiposRoutes, 
  playerPremiosRoutes
);

export default app;