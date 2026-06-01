import { Router } from 'express';
import { obtenerEquipos } from '../../controllers/adminController/EquiposController.js';

const router = Router();

router.get('/equipos', obtenerEquipos);

export default router;
