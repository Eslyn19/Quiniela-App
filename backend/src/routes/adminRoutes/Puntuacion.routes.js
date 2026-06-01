import { Router } from 'express';
import { obtenerPuntuaciones, actualizarPuntuacion } from '../../controllers/adminController/PuntuacionController.js';

const router = Router();

router.get('/puntuaciones', obtenerPuntuaciones);
router.patch('/puntuaciones/:id', actualizarPuntuacion);

export default router;
