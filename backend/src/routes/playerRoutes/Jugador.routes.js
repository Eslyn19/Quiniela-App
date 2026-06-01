import { Router } from 'express';
import { verificarJugador } from '../../controllers/playerController/JugadorController.js';

const router = Router();

router.get('/verify', verificarJugador);

export default router;
