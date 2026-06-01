import { Router } from 'express';
import {
    obtenerPremios,
    crearPremio,
    actualizarPremio,
    eliminarPremio,
    obtenerCanjes,
    actualizarEstadoCanje,
} from '../../controllers/adminController/PremiosController.js';

const router = Router();

router.get('/premios',              obtenerPremios);
router.post('/premios',             crearPremio);
router.put('/premios/:id',          actualizarPremio);
router.delete('/premios/:id',       eliminarPremio);
router.get('/canjes',               obtenerCanjes);
router.patch('/canjes/:id/estado',  actualizarEstadoCanje);

export default router;
