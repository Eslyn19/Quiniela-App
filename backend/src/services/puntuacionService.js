import Apuesta from '../models/Apuesta.js';
import TipoPuntuacion from '../models/TipoPuntuacion.js';
import Pronostico from '../models/Pronostico.js';
import UsuarioApuesta from '../models/UsuarioApuesta.js';
import HistorialPuntos from '../models/HistorialPuntos.js';

const ganador = (local, visitante) => {
    if (local > visitante) return 'LOCAL';
    if (visitante > local) return 'VISITANTE';
    return 'EMPATE';
};

// Calcula los puntos que gana/pierde un pronóstico dado el tipo de puntuación y el resultado real.
export const calcularPuntos = (tipo, puntosBase, multiplicador, penalizacion, pronoLocal, pronoVisitante, resLocal, resVisitante) => 
{
    const premio = parseFloat(puntosBase) * parseFloat(multiplicador);
    const castigo = -parseFloat(penalizacion);

    const ganRes = ganador(resLocal, resVisitante);
    const ganPron = ganador(pronoLocal, pronoVisitante);

    const acertoGanador = ganPron === ganRes;
    const esEmpate = ganRes === 'EMPATE';
    const esExacto = pronoLocal === resLocal && pronoVisitante === resVisitante;

    switch (tipo) {
        case 'Marcador Exacto':
            if (esExacto)      
                return premio;
            if (acertoGanador) 
                return parseFloat(puntosBase);
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

// Recalcula y persiste los puntos de todos los participantes de una apuesta
// para un evento dado. Resetea historial y acumulados antes de recalcular.
export const evaluarPronosticos = async (id_apuesta, id_evento, ptsA, ptsB, t) => {
    const apuesta = await Apuesta.findByPk(id_apuesta, { transaction: t });
    const tipo = await TipoPuntuacion.findByPk(apuesta.id_tipo_puntuacion, { transaction: t });

    const pronosticos = await Pronostico.findAll({ 
        where: { id_evento }, 
        transaction: t 
    });
    
    if (!pronosticos.length) 
        return;

    await HistorialPuntos.destroy({ 
        where: { id_apuesta }, 
        transaction: t 
    });
    
    await UsuarioApuesta.update({ puntos: 0 }, 
        { where: { id_apuesta }, 
        transaction: t 
    });

    const uas= await UsuarioApuesta.findAll({ 
        where: { id_apuesta }, 
        transaction: t 
    });
    
    const uaMap = new Map(uas.map(u => [u.id_usuario, u]));

    await Promise.all(pronosticos.map(async (prono) => {
        const puntos = calcularPuntos(
            tipo.nombre, tipo.puntos_base, tipo.multiplicador, tipo.penalizacion,
            prono.pts_local, prono.pts_visitante, ptsA, ptsB,
        );

        await HistorialPuntos.create({
            id_usuario: prono.id_usuario,
            id_apuesta,
            id_pronostico: prono.id_pronostico,
            puntos,
        }, { transaction: t });

        const ua = uaMap.get(prono.id_usuario);
        if (ua) {
            await ua.update({ 
                puntos: parseFloat(ua.puntos) + puntos }, { transaction: t });
        }
    }));
};
