import Usuario from '../../models/Usuario.js';
import EstadoUsuario from '../../models/EstadoUsuario.js';
import { comparePassword } from '../../utils/Encrypt.js';
import jwt from 'jsonwebtoken';

export const ingresarUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { username } });

        if (!usuario) 
            return res.status(401).json({ message: "Credenciales inválidas"});

        const isPasswordValid = await comparePassword(password, usuario.pass);
        if (!isPasswordValid) 
            return res.status(401).json({ message: "Credenciales inválidas"});

        const estadoReg = await EstadoUsuario.findOne({
            where: { id_usuario: usuario.id_usuario }
        });

        if (!estadoReg || estadoReg.estado !== 'APROBADO') {
            const mensajes = {
                PENDIENTE: 'Cuenta pendiente de aprobar.',
                RECHAZADO: 'Tu cuenta ha sido rechazada.',
                SUSPENDIDO: 'Tu cuenta fue suspendida.',
            };
            return res.status(403).json({
                message: mensajes[estadoReg?.estado] ?? 'Acceso denegado.'
            });
        }
        // Generar token JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        return res.status(200).json({
            message: "Ingreso exitoso",
            id_usuario: usuario.id_usuario,
            token: token,
            rol: estadoReg.rol,
        });
    } catch (error) {
        // Error de servidor, no exponer detalles específicos
        return res.status(500).json({ message: 'Error interno del sistema'});
    }
};
