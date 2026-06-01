import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FloatingLines from '../../../components/FloatingLines';
import '../../../css/pagesCSS/RankingGlobal.css';

const API = 'http://localhost:3000';
const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function RankingGlobal() {
    const [ranking, setRanking]   = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        AOS.init({ duration: 600, once: true, easing: 'ease-out-cubic', offset: 60 });
        fetch(`${API}/api/public/ranking-global`)
            .then(r => r.json())
            .then(d => setRanking(Array.isArray(d) ? d : []))
            .catch(() => setRanking([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="rg-page">
            <div className="rg-bg">
                <FloatingLines
                    linesGradient={['#45f56a', '#6f6f6f', '#6a6a6a']}
                    enabledWaves={['top', 'middle', 'bottom']}
                    lineCount={8}
                    lineDistance={8}
                    bendRadius={8}
                    bendStrength={-2}
                    interactive
                    parallax
                    animationSpeed={1}
                />
            </div>

            <div className="rg-content">
                <div className="rg-hero" data-aos="fade-down">
                    <span className="rg-label">RANKING GLOBAL</span>
                    <h1 className="rg-title">Los Mejores Jugadores</h1>
                </div>

                <div className="rg-wrap" data-aos="fade-up" data-aos-delay="80">
                    <div className="rg-header">
                        <span className="rg-titulo">Ranking General</span>
                    </div>

                    {loading ? (
                        <div className="rg-loading">
                            <span className="rg-dot" />
                            <span>Cargando ranking...</span>
                        </div>
                    ) : ranking.length === 0 ? (
                        <div className="rg-empty">Aún no hay jugadores con puntos acumulados.</div>
                    ) : (
                        <div className="rg-table-wrap">
                            <table className="rg-table">
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
                                        const pos = Number(row.posicion);
                                        return (
                                            <tr key={row.username}>
                                                <td className="rg-pos">
                                                    {pos <= 3
                                                        ? <span className="rg-medal">{MEDALLAS[pos - 1]}</span>
                                                        : <span className="rg-num">{pos}</span>
                                                    }
                                                </td>
                                                <td className="rg-username">{row.username}</td>
                                                <td className="rg-apuestas">{row.apuestas_participadas}</td>
                                                <td className="rg-puntos">
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
        </div>
    );
}
