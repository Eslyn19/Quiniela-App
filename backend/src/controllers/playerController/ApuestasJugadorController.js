import sequelize from '../../config/database.js';
import UsuarioApuesta from '../../models/UsuarioApuesta.js';
import Pronostico from '../../models/Pronostico.js';
import Evento from '../../models/Evento.js';
import Apuesta from '../../models/Apuesta.js';

// Llamar PROC desde la base de datos para obtener historial 
// de apuestas del jugador
export const obtenerApuestasJugador = async (req, res) => {
    try {
        const [apuestas] = await sequelize.query(`
            EXEC ObtenerApuestasJugador @id_usuario = :id_usuario`, 
            { replacements: { id_usuario: req.user.id_usuario } });

        return res.json(apuestas);
    } catch (error) {
        return res.status(500).json({ 
            message: `Metodo no encontrado en DB, ${error.message}` 
        });
    }
};

// Unir el id del Usuario a la apuesta ingresada
export const unirseApuesta = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    try {
        const apuesta = await Apuesta.findByPk(id);
        if (!apuesta) 
            return res.status(404).json({ message: 'Apuesta no encontrada' });

        if (apuesta.id_estado_apuesta !== 2) {
            return res.status(400).json({
                message: 'Solo puedes unirte a apuestas abiertas'
            });
        }

        if (new Date(apuesta.fecha_inicio) <= new Date()) {
            return res.status(400).json({
                message: 'La apuesta ya comenzó, no puedes unirte'
            });
        }

        const usuarioUnido = await UsuarioApuesta.findOne({ 
            where: { id_usuario, id_apuesta: id } 
        });
        
        if (usuarioUnido){
            return res.status(400).json({ 
                message: 'Actualmente participando en esta apuesta' 
            });
        }

        await UsuarioApuesta.create({ id_usuario, id_apuesta: id });

        return res.json({ message: 'Te has unido a la apuesta' });
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al unirse a apuesta, ${error.message}` 
        });
    }
};

// Ejecutar PROC desde la db para obtener el id del usuario a 
// el evento relacionado a apuesta
export const obtenerEventosApuesta = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    try {
        const [eventos] = await sequelize.query(
            `EXEC ObtenerEventosApuesta 
                @id_apuesta = :id_apuesta,
                @id_usuario = :id_usuario`,
            {
                replacements: {
                    id_apuesta: id,
                    id_usuario: id_usuario
                }
            }
        );

        return res.json(eventos);
    } catch (error) {
        return res.status(500).json({ 
             message: `Error al obtener evento de apuesta, ${error.message}` 
        });
    }
};

export const guardarPronostico = async (req, res) => {
    const { id } = req.params;
    const { pts_local, pts_visitante } = req.body;
    const id_usuario = req.user.id_usuario;

    if (pts_local === undefined 
        || pts_local === null 
        || pts_visitante === undefined 
        || pts_visitante === null) {
        return res.status(400).json({ 
            message: 'Local y visitante son requeridos' 
        });
    }

    const local = parseInt(pts_local, 10);
    const visitante = parseInt(pts_visitante, 10);

    if (isNaN(local) || isNaN(visitante) || local < 0 || visitante < 0) {
        return res.status(400).json({ 
            message: 'Los valores no pueden ser negativos' 
        });
    }

    try {
        const evento = await Evento.findByPk(id);
        
        if (!evento) 
            return res.status(404).json({ message: 'Evento no encontrado' });

        const apuesta = await Apuesta.findByPk(evento.id_apuesta);
        if (apuesta.id_estado_apuesta !== 2) {
            return res.status(400).json({ 
                message: 'La apuesta ya empezo, no puedes registrar pronóstico' 
            });
        }

        const usuarioUnido = await UsuarioApuesta.findOne({ 
            where: { id_usuario, id_apuesta: evento.id_apuesta } 
        });
        
        if (!usuarioUnido)
            return res.status(400).json({ 
                message: 'Debes unirte a la apuesta primero' 
            });

        if (evento.fecha && new Date(evento.fecha) <= new Date())
            return res.status(400).json({ 
                message: 'El evento ya comenzó, no puedes registrar pronóstico' 
            });

        const existente = await Pronostico.findOne({ 
            where: { id_usuario, id_evento: id } 
        });
        
        if (existente){
            return res.status(400).json({ 
                message: 'Ya registraste un pronóstico para este evento' 
            });
        }

        const nuevo = await Pronostico.create({ 
            id_usuario, 
            id_evento: id,
            pts_local: local, 
            pts_visitante: visitante 
        });

        return res.status(201).json({ 
            message: 'Pronóstico guardado',
            id_pronostico: nuevo.id_pronostico 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al guardar pronostico, ${error.message}` 
        });
    }
};

// llamar metodo de la DB para obtener el ranking de apuestas
// por jugador
export const obtenerParticipantesApuesta = async (req, res) => {
    const { id } = req.params;
    try {
        const [participantes] = await sequelize.query(
            `EXEC ObtenerParticipantesApuesta @id_apuesta = :id_apuesta`,
            { replacements: { id_apuesta: id } }
        );
        return res.json(participantes);
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener participantes, ${error.message}`
        });
    }
};

export const obtenerRanking = async (req, res) => {
    const { id } = req.params;

    try {
        const [ranking] = await sequelize.query(
            `EXEC ObtenerRanking @id_apuesta = :id_apuesta`,
            {
                replacements: { id_apuesta: id }
            }
        );

        return res.json(ranking);
    } catch (error) {
        return res.status(500).json(
        {
            message: `Error al obtener puestos del ranking, ${error.message}`
        });
    }
};

export const obtenerRankingGlobal = async (req, res) => {
    try {
        const [ranking] = await sequelize.query(`EXEC ObtenerRankingGlobal`);
        return res.json(ranking);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al obtener ranking global, ${error.message}` 
        });
    }
};
