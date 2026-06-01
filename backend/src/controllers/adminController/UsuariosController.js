import sequelize from '../../config/database.js';
import EstadoUsuario from '../../models/EstadoUsuario.js';

export const obtenerUsuarios = async (req, res) =>
{
  try {
    const [usuarios] = await sequelize.query(`EXEC obtenerUsuarios`);
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ 
        message: error.message 
    });
  }
};

export const actualizarEstado = async (req, res) => 
{
  const { id } = req.params;
  const { estado } = req.body;

  if (!['APROBADO', 'PENDIENTE', 'RECHAZADO', 'SUSPENDIDO'].includes(estado)) {
    return res.status(400).json({ message: 'Estado invalido' });
  }

  try {
    const registro = await EstadoUsuario.findOne({ where: { id_usuario: id } });
    
    if (!registro){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await registro.update({ estado });
    return res.json({ message: 'Estado actualizado' });
  } catch (error) {
    return res.status(500).json({ 
        message: 'Error al actualizar estado de usuario' 
    });
  }
};