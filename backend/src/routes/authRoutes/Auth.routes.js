import { Router } from 'express';

import { registrarUsuario } from '../../controllers/authController/RegisterController.js';
import { ingresarUsuario } from '../../controllers/authController/LoginController.js';
import { resetPassword } from '../../controllers/authController/ResetPasswordController.js';
import { validarRegistro } from '../../middlewares/RegisterValidator.js';
import { validarLogin } from '../../middlewares/LoginValidator.js';
import { validarResetPassword } from '../../middlewares/ResetPasswordValidator.js';
import { loginLimiter, registerLimiter } from '../../middlewares/rateLimit.js';

const router = Router();

router.post('/register', registerLimiter, validarRegistro, registrarUsuario);
router.post('/login', loginLimiter, validarLogin, ingresarUsuario);
router.post('/reset-password', validarResetPassword, resetPassword);

export default router;
