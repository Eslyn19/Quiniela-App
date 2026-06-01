import { Router } from 'express';
import { verificarAdmin } from '../../controllers/adminController/AdminController.js';

const router = Router();

router.get('/verify', verificarAdmin);

export default router;
