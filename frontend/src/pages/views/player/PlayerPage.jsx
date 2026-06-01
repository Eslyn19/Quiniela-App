import { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Dock from '../../../components/Dock';
import StarBorder from '../../../components/StarBorder';
import MagicRings from '../../../components/MagicRings';
import LoadingScreen from '../../../components/LoadingScreen';
import { API } from './constants';
import { IcoBets, IcoRanking, IcoLogout, IcoTeams, IcoPlanet, IcoStore } from './icons';
import SeccionApuestas from './SeccionApuestas';
import SeccionRanking  from './SeccionRanking';
import SeccionEquipos  from './SeccionEquipos';
import SeccionGlobal   from './SeccionGlobal';
import SeccionPremios  from './SeccionPremios';
import '../../../css/pagesCSS/Player.css';

export default function PlayerPage() {
    const [seccion, setSeccion] = useState('apuestas');
    const [jugador, setJugador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apuestas, setApuestas] = useState([]);

    const getHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }), []);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        AOS.init({ duration: 600, once: true, easing: 'ease-out-cubic', offset: 60 });
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch(`${API}/api/player/verify`, { headers: getHeaders() });
                if (!res.ok) { window.location.href = '/login'; return; }
                setJugador(await res.json());

                const rA = await fetch(`${API}/api/player/apuestas`, { headers: getHeaders() });
                const aData = await rA.json();
                setApuestas(Array.isArray(aData) ? aData : []);
            } catch {
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [getHeaders]);

    if (loading) return <LoadingScreen message="Verificando acceso..." />;

    const dockItems = [
        { label: 'Apuestas',      icon: <IcoBets />,    onClick: () => setSeccion('apuestas'), className: seccion === 'apuestas' ? 'dock-active' : '' },
        { label: 'Ranking',       icon: <IcoRanking />, onClick: () => setSeccion('ranking'),  className: seccion === 'ranking'  ? 'dock-active' : '' },
        { label: 'Global',        icon: <IcoPlanet />,  onClick: () => setSeccion('global'),   className: seccion === 'global'   ? 'dock-active' : '' },
        { label: 'Equipos',       icon: <IcoTeams />,   onClick: () => setSeccion('equipos'),  className: seccion === 'equipos'  ? 'dock-active' : '' },
        { label: 'Premios',       icon: <IcoStore />,   onClick: () => setSeccion('premios'),  className: seccion === 'premios'  ? 'dock-active' : '' },
        { label: 'Cerrar sesión', icon: <IcoLogout />,  onClick: logout,                       className: 'dock-logout' },
    ];

    return (
        <div className="player-page">
            <div className="player-bg-rings">
                <MagicRings
                    color="#9e1a00"
                    colorTwo="#ff9d6f"
                    ringCount={6}
                    speed={1}
                    attenuation={10}
                    lineThickness={2}
                    baseRadius={0.35}
                    radiusStep={0.1}
                    scaleRate={0.1}
                    opacity={1}
                    noiseAmount={0.1}
                    rotation={0}
                    ringGap={1.5}
                    fadeIn={0.7}
                    fadeOut={0.5}
                    followMouse={false}
                    mouseInfluence={0.2}
                    hoverScale={1.2}
                    parallax={0.05}
                    clickBurst={false}
                />
            </div>

            <header className="player-dock-header">
                <StarBorder as="div" className="player-badge-border" color="#dc2626" speed="5s">
                    Jugador
                </StarBorder>
                <Dock items={dockItems} panelHeight={60} magnification={76} baseItemSize={46} distance={140} />
                <StarBorder as="div" className="player-whoami-border" color="#ef4444" speed="4s">
                    {jugador?.username}
                </StarBorder>
            </header>

            <main className="player-main">
                {seccion === 'apuestas' && (
                    <SeccionApuestas
                        apuestas={apuestas}
                        setApuestas={setApuestas}
                        getHeaders={getHeaders}
                        jugadorId={jugador?.id_usuario}
                    />
                )}
                {seccion === 'ranking' && (
                    <SeccionRanking
                        apuestas={apuestas}
                        getHeaders={getHeaders}
                        username={jugador?.username}
                    />
                )}
                {seccion === 'global' && (
                    <SeccionGlobal
                        getHeaders={getHeaders}
                        username={jugador?.username}
                    />
                )}
                {seccion === 'equipos' && (
                    <SeccionEquipos getHeaders={getHeaders} />
                )}
                {seccion === 'premios' && (
                    <SeccionPremios getHeaders={getHeaders} />
                )}
            </main>
        </div>
    );
}
