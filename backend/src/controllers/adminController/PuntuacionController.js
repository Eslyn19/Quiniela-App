import TipoPuntuacion from '../../models/TipoPuntuacion.js';

const TIPOS_FIJOS = ['MARCADOR EXACTO', 'GANADOR', 'PERDEDOR', 'EMPATE'];

export const obtenerPuntuaciones = async (req, res) => {
    try {
        const tipos = await TipoPuntuacion.findAll({ order: [['id_tipo_puntuacion', 'ASC']] });
        return res.json(tipos);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al obtener tipos de puntuacion, ${error.message}`
        });
    }
};

export const actualizarPuntuacion = async (req, res) => {
    const { puntos_base, 
            multiplicador, 
            penalizacion } = req.body;

    try {
        const IDtipoPuntuacion = await TipoPuntuacion.findByPk(req.params.id);
        if (!IDtipoPuntuacion) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        
        // Si es un tipo fijo, no se permite cambiar el nombre ni el tipo de apuesta
        await IDtipoPuntuacion.update({
            puntos_base: parseFloat(puntos_base) ?? IDtipoPuntuacion.puntos_base,
            multiplicador: parseFloat(multiplicador) ?? IDtipoPuntuacion.multiplicador,
            penalizacion: parseFloat(penalizacion) ?? IDtipoPuntuacion.penalizacion,
        });

        return res.json(IDtipoPuntuacion);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al actualizar puntuacion, ${error.message}`
        });
    }
};
