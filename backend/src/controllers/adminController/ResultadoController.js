import sequelize from '../../config/database.js';
import Apuesta from '../../models/Apuesta.js';
import Evento from '../../models/Evento.js';
import EventoResultado from '../../models/EventoResultado.js';
import Pronostico from '../../models/Pronostico.js';
import UsuarioApuesta from '../../models/UsuarioApuesta.js';
import HistorialPuntos from '../../models/HistorialPuntos.js';
import TipoPuntuacion from '../../models/TipoPuntuacion.js';

// DB: ID_ESTADO_APUESTA -> CERRADA 3, FINALIZADA 4
const ID_CERRADA = 3;
const ID_FINALIZADA = 4;
const UMBRAL_GOLES = 2.5;

const ganador = (local, visitante) => {
    if (local > visitante) return 'LOCAL';
    if (visitante > local) return 'VISITANTE';
    return 'EMPATE';
};

const calcularPuntos = (
    tipo, 
    puntosBase, 
    multiplicador, 
    penalizacion,
    pronoLocal, 
    pronoVisitante, 
    resLocal, 
    resVisitante) => {
    const premio = parseFloat(puntosBase) * parseFloat(multiplicador);
    const castigo = -parseFloat(penalizacion);

    const ganRes = ganador(resLocal, resVisitante);
    const ganPron = ganador(pronoLocal, pronoVisitante);

    const acertoGanador = ganPron === ganRes;
    const esEmpate = ganRes === 'EMPATE';
    const esExacto = pronoLocal === resLocal && pronoVisitante === resVisitante;

    // Validar tipos fijos primero
    switch (tipo) {
        case 'Marcador Exacto':
        if (esExacto) return premio;
        if (acertoGanador) return parseFloat(puntosBase); // acierta ganador pero no marcador
        return castigo;

        case 'Resultado Victoria':
        case 'Resultado Derrota':
        return !esEmpate && acertoGanador ? premio : castigo;

        case 'Resultado Empate':
        return esEmpate ? premio : castigo;

        case 'Ganador del torneo':
        default:
        return acertoGanador ? premio : castigo;
    }
};

const evaluarPronosticos = async (id_apuesta, id_evento, ptsA, ptsB, t) => {
    const apuesta = await Apuesta.findByPk(id_apuesta, { transaction: t });
    const tipo = await TipoPuntuacion.findByPk(apuesta.id_tipo_puntuacion, { transaction: t });

    const pronosticos = await Pronostico.findAll({ where: { id_evento }, transaction: t });
    if (!pronosticos.length) return;

    // Actualizar las 2 tablas en una sola transacción para evitar inconsistencias
    await HistorialPuntos.destroy({ 
        where: { id_apuesta }, 
        transaction: t 
    });
    
    await UsuarioApuesta.update({ puntos: 0 }, { 
        where: { id_apuesta }, 
        transaction: t 
    });

    for (const prono of pronosticos) 
    {
        const puntos = calcularPuntos(
            tipo.nombre, 
            tipo.puntos_base, 
            tipo.multiplicador, 
            tipo.penalizacion, 
            prono.pts_local,
            prono.pts_visitante,
            ptsA, ptsB,
        );

        await HistorialPuntos.create({
            id_usuario: prono.id_usuario,
            id_apuesta,
            id_pronostico: prono.id_pronostico,
            puntos, }, { transaction: t });

        const ua = await UsuarioApuesta.findOne({
            where: { id_usuario: prono.id_usuario, id_apuesta },
            transaction: t,
        });

        if (ua) {
            await ua.update({ puntos: parseFloat(ua.puntos) + puntos }
            , { transaction: t });
        }
    }
};

export const obtenerApuestasResultados = async (req, res) => {
    try {
        const [rows] = await sequelize.query(`EXEC ObtenerApuestasResultados`);
        return res.json(rows);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al obtener apuestas, detail: ${error.message}`
        });
    }
};

export const guardarResultadoApuesta = async (req, res) => {
    const { id } = req.params;
    const { pts_local, pts_visitante, equipo_local = '', equipo_visitante = '' } = req.body;

    if (pts_local === undefined || pts_local === null ||
        pts_visitante === undefined || pts_visitante === null) {
        return res.status(400).json({ 
            message: 'Local y Visitante son requeridos' 
        });
    }

    const ptsA = Number(pts_local);
    const ptsB = Number(pts_visitante);

    if (isNaN(ptsA) || isNaN(ptsB) || ptsA < 0 || ptsB < 0) {
        return res.status(400).json({ 
            message: 'Los marcadores no pueden ser negativos' 
        });
    }

    const t = await sequelize.transaction();
    try {
        const apuesta = await Apuesta.findByPk(id, { transaction: t });

        if (!apuesta) { 
            await t.rollback(); 
            return res.status(404).json({ 
                message: 'Apuesta no encontrada' 
            }); 
        }

        if (![ID_CERRADA, ID_FINALIZADA].includes(apuesta.id_estado_apuesta)) {
            await t.rollback();
            return res.status(400).json({ 
                message: 'La apuesta debe estar cerrada o finalizada' 
            });
        }

        let evento = await Evento.findOne({ 
            where: { id_apuesta: id }, 
            transaction: t 
        });
        
        if (!evento) {
            evento = await Evento.create({
                id_apuesta: id,
                nombre: apuesta.nombre,
                fecha: new Date(),
            }, { transaction: t });
        }

        const teamPart  = equipo_local && equipo_visitante ? `${equipo_local} vs ${equipo_visitante}: ` : '';
        const resultado = `${teamPart}${ptsA} - ${ptsB}`;
        const existing  = await EventoResultado.findOne({ 
            where: { id_evento: evento.id_evento }, 
            transaction: t 
        });

        if (existing) {
            await existing.update({ resultado, pts_equipo_a: ptsA, pts_equipo_b: ptsB }
                , { transaction: t }
            );
        } else {
            await EventoResultado.create({
                id_evento: evento.id_evento,
                resultado,
                pts_equipo_a: ptsA,
                pts_equipo_b: ptsB,
            }, { transaction: t });
        }

        await evaluarPronosticos(Number(id), evento.id_evento, ptsA, ptsB, t);

        await t.commit();
        return res.json({ 
            message: 'Resultado guardado y puntos actualizados' 
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ 
            message: `Error al guardar resultado: ${error.message}` 
        });
    }
};

export const actualizarEstadoResultado = async (req, res) => {
    const { id } = req.params;
    const { id_estado_apuesta } = req.body;

    if (![ID_CERRADA, ID_FINALIZADA].includes(Number(id_estado_apuesta))) {
        return res.status(400).json({ 
            message: 'Solo se permite cerrada o finalizada' 
        });
    }

    try {
        const apuesta = await Apuesta.findByPk(id);
        if (!apuesta){
            return res.status(404).json({ 
                message: 'Apuesta no encontrada' 
            });
        }

        if (apuesta.id_estado_apuesta === ID_FINALIZADA) {
            return res.status(400).json({ 
                message: 'Una apuesta finalizada no puede cambiar de estado' 
            });
        }

        await apuesta.update({ id_estado_apuesta });
        return res.json({ message: 'Estado actualizado' });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al actualizar estado resultado de apuesta' 
        });
    }
};
