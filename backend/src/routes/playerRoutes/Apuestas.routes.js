import { Router } from 'express';
import {
    obtenerApuestasJugador,
    unirseApuesta,
    obtenerEventosApuesta,
    guardarPronostico,
    obtenerParticipantesApuesta,
    obtenerRanking,
    obtenerRankingGlobal,
} from '../../controllers/playerController/ApuestasJugadorController.js';

const router = Router();

router.get('/apuestas', obtenerApuestasJugador);
router.post('/apuestas/:id/unirse', unirseApuesta);
router.get('/apuestas/:id/eventos', obtenerEventosApuesta);
router.post('/eventos/:id/pronostico', guardarPronostico);
router.get('/apuestas/:id/participantes', obtenerParticipantesApuesta);
router.get('/apuestas/:id/ranking', obtenerRanking);
router.get('/ranking-global', obtenerRankingGlobal);

export default router;
