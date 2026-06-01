import { useState, useEffect } from 'react';
import { EmptyState } from './shared';
import { API } from './constants';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function SeccionGlobal({ getHeaders, username }) {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/player/ranking-global`, { headers: getHeaders() })
            .then(r => r.json())
            .then(d => setRanking(Array.isArray(d) ? d : []))
            .catch(() => setRanking([]))
            .finally(() => setLoading(false));
    }, [getHeaders]);

    return (
        <div className="player-seccion">

            <div data-aos="fade-down">
                <h2 className="player-section-title">Global</h2>
                <p className="player-section-sub">Jugadores con más puntos acumulados en todas las apuestas.</p>
            </div>

            <div className="global-wrap" data-aos="fade-up" data-aos-delay="60">
                <div className="global-header">
                    <span className="global-titulo">Ranking General</span>
                    <span className="global-badge">Todas las apuestas</span>
                </div>

                {loading ? (
                    <p className="ranking-loading">Cargando ranking global...</p>
                ) : ranking.length === 0 ? (
                    <EmptyState msg="Aún no hay jugadores con puntos acumulados." />
                ) : (
                    <div className="ranking-table-wrap">
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Jugador</th>
                                    <th>Apuestas</th>
                                    <th>Puntos totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map(row => {
                                    const pos  = Number(row.posicion);
                                    const isMe = row.username === username;
                                    return (
                                        <tr key={row.username} className={isMe ? 'rank-current' : ''}>
                                            <td className="rank-pos">
                                                {pos <= 3
                                                    ? <span className="rank-medal">{MEDALLAS[pos - 1]}</span>
                                                    : <span className="rank-num">{pos}</span>
                                                }
                                            </td>
                                            <td className="rank-username">
                                                {row.username}
                                                {isMe && <span className="rank-yo"> (tú)</span>}
                                            </td>
                                            <td className="rank-pronosticos">{row.apuestas_participadas}</td>
                                            <td className="rank-puntos global-puntos">
                                                {Number(row.puntos_totales ?? 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
