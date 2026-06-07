import Usuario from '../../models/Usuario.js';
import { hashPassword, comparePassword } from '../../utils/Encrypt.js';

export const resetPassword = async (req, res) => {
    const { username, currentPassword, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { username } });

        if (!usuario) 
            return res.status(404).json({ message: "Usuario no encontrado" });


        const valido = await comparePassword(currentPassword, usuario.pass);
        if (!valido) 
            return res.status(401).json({ message: "Datos inválidos" });
        

        const hashedPass = await hashPassword(password);
        await usuario.update({ pass: hashedPass });

        return res.status(200).json({
            message: "Contraseña actualizada correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al restablecer contraseña!"
        });
    }
};
