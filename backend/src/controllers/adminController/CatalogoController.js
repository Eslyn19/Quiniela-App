import EstadoApuesta from '../../models/EstadoApuesta.js';

export const getCatalogos = async (req, res) => {
  try {
    const estados = await EstadoApuesta.findAll({ order: [['id_estado_apuesta', 'ASC']] });
    return res.json({ estados });
  } catch (error) {
    return res.status(500).json({
      message: `Error al obtener catalogo, ${error.message}`
    });
  }
};
