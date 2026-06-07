import sequelize from '../../config/database.js';
import Persona from '../../models/Persona.js';
import Usuario from '../../models/Usuario.js';
import EstadoUsuario from '../../models/EstadoUsuario.js';
import { hashPassword } from '../../utils/Encrypt.js';

export const registrarUsuario = async (req, res) => {
    const datos = req.body;
    const t = await sequelize.transaction();

    try
    {
        const nuevaPersona = await Persona.create(
        {
            primer_nombre: datos.primer_nombre,
            segundo_nombre: datos.segundo_nombre,
            primer_apellido: datos.primer_apellido,
            segundo_apellido: datos.segundo_apellido,
            fecha_nacimiento: datos.fecha_nacimiento
        }, { transaction: t });

        // Encriptar contraseña antes de guardar
        const hashedPass = await hashPassword(datos.password);
        const nuevoUsuario = await Usuario.create(
        {
            id_persona: nuevaPersona.id_persona,
            correo_electronico: datos.correo_electronico,
            username: datos.username,
            pass: hashedPass
        }, { transaction: t });

        await EstadoUsuario.create({
            id_usuario: nuevoUsuario.id_usuario,
            rol: 'JUGADOR',
            estado: 'PENDIENTE'
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({
            message: "Registro exitoso",
            id_usuario: nuevoUsuario.id_usuario
        });

    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: "Error al registrar usuario" });
    }
};
