import { Router } from 'express';
import { obtenerEquipos } from '../../controllers/adminController/EquiposController.js';
import { getCatalogos } from '../../controllers/adminController/CatalogoController.js';

const router = Router();

router.get('/equipos', obtenerEquipos);
router.get('/catalogos', getCatalogos);

export default router;
