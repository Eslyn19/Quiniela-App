import { useState, useEffect } from 'react';
import { EmptyState } from './shared';
import { API } from './constants';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function SeccionRanking({ apuestas, getHeaders, username }) {
    const [selectedId, setSelectedId] = useState('');
    const [ranking, setRanking]       = useState([]);
    const [loading, setLoading]       = useState(false);

    const apuestasConParticipacion = apuestas.filter(a => !!a.ya_unido);

    useEffect(() => {
        if (!selectedId) return;
        setLoading(true);
        fetch(`${API}/api/player/apuestas/${selectedId}/ranking`, { headers: getHeaders() })
            .then(r => r.json())
            .then(d => setRanking(Array.isArray(d) ? d : []))
            .catch(() => setRanking([]))
            .finally(() => setLoading(false));
    }, [selectedId, getHeaders]);

    const apuestaSeleccionada = apuestas.find(a => a.id_apuesta === Number(selectedId));

    return (
        <div className="player-seccion">

            <div data-aos="fade-down">
                <h2 className="player-section-title">Ranking</h2>
                <p className="player-section-sub">¿En qué posición estás?</p>
            </div>

            <div className="ranking-select-bar" data-aos="fade-up" data-aos-delay="60">
                <select
                    className="ranking-select"
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                >
                    <option value="">Seleccionar apuesta...</option>
                    {apuestasConParticipacion.map(a => (
                        <option key={a.id_apuesta} value={a.id_apuesta}>
                            {a.nombre} — {a.estado}
                        </option>
                    ))}
                </select>
            </div>

            {!selectedId && (
                <div data-aos="fade-up" data-aos-delay="120">
                    <EmptyState msg="Selecciona una apuesta en la que participes para ver el ranking." />
                </div>
            )}

            {selectedId && (
                <div className="ranking-wrap" data-aos="fade-up" data-aos-delay="80">
                    {apuestaSeleccionada && (
                        <div className="ranking-header">
                            <span className="ranking-titulo">{apuestaSeleccionada.nombre}</span>
                            <span className="ranking-deporte">{apuestaSeleccionada.deporte}</span>
                        </div>
                    )}

                    {loading ? (
                        <p className="ranking-loading">Cargando ranking...</p>
                    ) : ranking.length === 0 ? (
                        <EmptyState msg="Nadie ha participado en esta apuesta aún." />
                    ) : (
                        <div className="ranking-table-wrap">
                            <table className="ranking-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Jugador</th>
                                        <th>Pronósticos</th>
                                        <th>Puntos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ranking.map(row => {
                                        const pos   = Number(row.posicion);
                                        const isMe  = row.username === username;
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
                                                <td className="rank-pronosticos">{row.pronosticos}</td>
                                                <td className="rank-puntos">
                                                    {Number(row.puntos ?? 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
