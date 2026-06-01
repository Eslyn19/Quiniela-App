import { Router } from 'express';
import {
    obtenerPremiosDisponibles,
    obtenerPuntosDisponibles,
    canjearPremio,
    obtenerMisCanjes,
} from '../../controllers/playerController/PremiosJugadorController.js';

const router = Router();

router.get('/premios',          obtenerPremiosDisponibles);
router.get('/premios/puntos',   obtenerPuntosDisponibles);
router.post('/premios/:id/canjear', canjearPremio);
router.get('/mis-canjes',       obtenerMisCanjes);

export default router;
