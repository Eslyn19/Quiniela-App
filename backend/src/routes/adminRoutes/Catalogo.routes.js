import { getCatalogos } from '../../controllers/adminController/CatalogoController.js';
import { Router } from 'express';

const router = Router();

router.get('/catalogos', getCatalogos);

export default router;
