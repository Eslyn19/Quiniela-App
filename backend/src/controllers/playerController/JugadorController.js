import EstadoUsuario from '../../models/EstadoUsuario.js';
import Usuario from '../../models/Usuario.js';
import Persona from '../../models/Persona.js';

// Determinar si el USUARIO tiene el ROL asignado de JUGADOR
export const verificarJugador = async (req, res) => {
    try {
        const estado = await EstadoUsuario.findOne({ 
            where: { id_usuario: req.user.id_usuario }
        });

        if (!estado || estado.rol !== 'JUGADOR' || estado.estado !== 'APROBADO') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const usuario = await Usuario.findByPk(req.user.id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const persona = await Persona.findByPk(usuario.id_persona);
        if (!persona) {
            return res.status(404).json({ message: 'No existen creedenciales' });
        }

        return res.json({
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            correo: usuario.correo_electronico,
            nombre: `${persona.primer_nombre} ${persona.primer_apellido}`,
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error interno del sistema' 
        });
    }
};
