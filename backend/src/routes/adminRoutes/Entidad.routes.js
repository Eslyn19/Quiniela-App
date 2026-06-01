import { Router } from 'express';
import { obtenerUsuarios, actualizarEstado } from "../../controllers/adminController/UsuariosController.js"

const router = Router();

router.get('/usuarios', obtenerUsuarios);
router.patch('/usuarios/:id/estado', actualizarEstado);

export default router;