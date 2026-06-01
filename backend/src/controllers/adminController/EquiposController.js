import sequelize from '../../config/database.js';

export const obtenerEquipos = async (req, res) => {
  try {
    const [equipos] = await sequelize.query('EXEC ObtenerEquipos');
    return res.json(equipos);
  } catch (error) {
    return res.status(500).json({
      message: `Error al obtener equipos, ${error.message}`
    });
  }
};
