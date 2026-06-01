import { Router } from 'express';
import { 
    obtenerApuestas, 
    crearApuesta, 
    eliminarApuesta, 
    actualizarEstadoApuesta 
} from "../../controllers/adminController/ApuestaController.js"

const router = Router();

router.get('/apuestas', obtenerApuestas);
router.post('/apuestas', crearApuesta);
router.patch('/apuestas/:id/estado', actualizarEstadoApuesta);
router.delete('/apuestas/:id', eliminarApuesta);

export default router;