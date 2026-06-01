import { Router } from 'express';
import {
    obtenerApuestasResultados,
    guardarResultadoApuesta,
    actualizarEstadoResultado,
} from '../../controllers/adminController/ResultadoController.js';

const router = Router();

router.get('/resultados', obtenerApuestasResultados);
router.post('/resultados/apuesta/:id/resultado', guardarResultadoApuesta);
router.patch('/resultados/apuesta/:id/estado', actualizarEstadoResultado);

export default router;
