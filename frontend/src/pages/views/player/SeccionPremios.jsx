import { useState, useEffect, useCallback } from 'react';
import { API } from './constants';

const estadoColor = { PENDIENTE: '#f59e0b', ENTREGADO: '#22c55e', RECHAZADO: '#ef4444' };
const estadoIcon  = { PENDIENTE: '⏳', ENTREGADO: '✅', RECHAZADO: '❌' };

export default function SeccionPremios({ getHeaders }) {
    const [tab, setTab] = useState('tienda');
    const [premios, setPremios] = useState([]);
    const [canjes, setCanjes] = useState([]);
    const [puntos, setPuntos] = useState({ disponible: 0, total: 0, gastado: 0 });
    const [loading, setLoading]  = useState(true);
    const [canjeando, setCanjeando] = useState(null);
    const [msg, setMsg] = useState(null);
    const [lightbox, setLightbox] = useState(null); // { src, alt }

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e) => { 
            if (e.key === 'Escape') 
                setLightbox(null); 
            };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [lightbox]);

    const cargarDatos = useCallback(async () => {
        setLoading(true);
        try {
            const [rP, rPts, rC] = await Promise.all([
                fetch(`${API}/api/player/premios`, { headers: getHeaders() }),
                fetch(`${API}/api/player/premios/puntos`, { headers: getHeaders() }),
                fetch(`${API}/api/player/mis-canjes`, { headers: getHeaders() }),
            ]);
            const [pData, ptsData, cData] = await Promise.all([rP.json(), rPts.json(), rC.json()]);
            setPremios(Array.isArray(pData) ? pData : []);
            setPuntos(ptsData);
            setCanjes(Array.isArray(cData) ? cData : []);
        } finally {
            setLoading(false);
        }
    }, [getHeaders]);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const handleCanjear = async (premio) => {
        if (!confirm(`¿Canjear "${premio.nombre}" por ${premio.costo_puntos} puntos?`)) return;
        setCanjeando(premio.id_premio);
        setMsg(null);
        try {
            const res  = await fetch(`${API}/api/player/premios/${premio.id_premio}/canjear`, {
                method: 'POST', headers: getHeaders(),
            });
            const data = await res.json();
            if (!res.ok) { setMsg({ tipo: 'error', texto: data.message }); return; }
            setMsg({ tipo: 'ok', texto: data.message });
            await cargarDatos();
        } finally {
            setCanjeando(null);
        }
    };

    const hoy = new Date();
    const premioDisponible = (p) => {
        if (!p.activo) return false;
        if (p.stock !== null && p.stock <= 0) return false;
        if (p.fecha_inicio && new Date(p.fecha_inicio) > hoy) return false;
        if (p.fecha_fin && new Date(p.fecha_fin) < hoy) return false;
        return true;
    };

    const imgSrc = (p) => {
        if (!p.imagen_url) return null;
        return p.imagen_url.startsWith('/') ? `${API}${p.imagen_url}` : p.imagen_url;
    };

    if (loading) return (
        <div className="ps-loading">
            <div className="ps-spinner" />
            <span>Cargando premios...</span>
        </div>
    );

    return (
        <div className="ps-wrap">
            {/* ── Header ── */}
            <div className="ps-header" data-aos="fade-down">
                <div className="ps-header-left">
                    <h2 className="ps-title">Tienda de Premios</h2>
                    <p className="ps-sub">Canjea tus puntos por recompensas exclusivas</p>
                </div>
                <div className="ps-puntos-badge">
                    <div className="ps-puntos-ring">
                        <span className="ps-puntos-val">{puntos.disponible}</span>
                        <span className="ps-puntos-lbl">puntos</span>
                    </div>
                    <div className="ps-puntos-detail">
                        <span>Total ganados: <strong>{puntos.total}</strong></span>
                        <span>Gastados: <strong>{puntos.gastado}</strong></span>
                    </div>
                </div>
            </div>
            {/* ── Tabs ── */}
            <div className="ps-tabs" data-aos="fade-up">
                {['tienda', 'mis-canjes'].map(t => (
                    <button
                        key={t}
                        className={`ps-tab${tab === t ? ' active' : ''}`}
                        onClick={() => { setTab(t); setMsg(null); }}
                    >
                        {t === 'tienda' ? '🏪 Tienda' : '📋 Mis Canjes'}
                        {t === 'mis-canjes' && canjes.length > 0 && (
                            <span className="ps-tab-count">{canjes.length}</span>
                        )}
                    </button>
                ))}
            </div>
            {/* ── Feedback ── */}
            {msg && (
                <div className={`ps-msg ${msg.tipo}`} data-aos="fade-in">
                    {msg.tipo === 'ok' ? '✓ ' : '✗ '}{msg.texto}
                </div>
            )}
            {/* ── Tienda ── */}
            {tab === 'tienda' && (
                <div className="ps-grid" data-aos="fade-up">
                    {premios.length === 0 ? (
                        <div className="ps-empty">
                            <div className="ps-empty-ico">🎁</div>
                            <p>No hay premios disponibles por ahora.</p>
                            <span>Vuelve pronto para ver nuevas recompensas</span>
                        </div>
                    ) : premios.map((p, idx) => {
                        const disponible = premioDisponible(p);
                        const sinPuntos = puntos.disponible < p.costo_puntos;
                        const bloqueado = !disponible || sinPuntos;
                        const src = imgSrc(p);
                        const progreso = Math.min(100, Math.round((puntos.disponible / p.costo_puntos) * 100));

                        return (
                            <div
                                key={p.id_premio}
                                className={`ps-card${!disponible ? ' ps-card--agotado' : ''}`}
                                data-aos="fade-up"
                                data-aos-delay={idx * 60}
                            >
                                {/* Imagen */}
                                <div className="ps-card-img">
                                    {src
                                        ? <img
                                            src={src}
                                            alt={p.nombre}
                                            style={{ cursor: 'zoom-in' }}
                                            onClick={() => setLightbox({ src, alt: p.nombre })}
                                            onError={e => {
                                                e.target.style.display = 'none';
                                                const ph = e.target.parentElement.querySelector('.ps-card-img-placeholder');
                                                if (ph) ph.style.display = 'flex';
                                            }}
                                          />
                                        : null
                                    }
                                    <div className="ps-card-img-placeholder" style={{ display: src ? 'none' : 'flex' }}>🎁</div>
                                    {!disponible && (
                                        <div className="ps-card-overlay-agotado">
                                            {p.stock === 0 ? 'AGOTADO' : 'NO DISPONIBLE'}
                                        </div>
                                    )}
                                    <div className="ps-card-costo-chip">
                                        <span>{p.costo_puntos}</span> pts
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="ps-card-body">
                                    <p className="ps-card-nombre">{p.nombre}</p>
                                    <p className="ps-card-desc">{p.descripcion}</p>

                                    <div className="ps-card-badges">
                                        {p.stock !== null && (
                                            <span className={`ps-badge${p.stock === 0 ? ' ps-badge--red' : ''}`}>
                                                {p.stock === 0 ? 'Agotado' : `${p.stock} disponibles`}
                                            </span>
                                        )}
                                        {p.fecha_fin && (
                                            <span className="ps-badge ps-badge--amber">
                                                Hasta {new Date(p.fecha_fin).toLocaleDateString('es-CO')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Barra de progreso de puntos */}
                                    {disponible && sinPuntos && (
                                        <div className="ps-progress-wrap">
                                            <div className="ps-progress-bar">
                                                <div className="ps-progress-fill" style={{ width: `${progreso}%` }} />
                                            </div>
                                            <span className="ps-progress-lbl">
                                                Te faltan {p.costo_puntos - puntos.disponible} pts
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="ps-card-footer">
                                    <button
                                        className={`ps-canjear-btn${bloqueado ? ' disabled' : ''}`}
                                        disabled={bloqueado || canjeando === p.id_premio}
                                        onClick={() => handleCanjear(p)}
                                        title={
                                            !disponible  ? 'Premio no disponible' :
                                            sinPuntos    ? `Necesitas ${p.costo_puntos - puntos.disponible} pts más` :
                                            'Canjear premio'
                                        }
                                    >
                                        {canjeando === p.id_premio ? (
                                            <><span className="ps-btn-spinner" /> Canjeando...</>
                                        ) : !disponible ? 'No disponible' :
                                           sinPuntos   ? 'Puntos insuficientes' :
                                           'Canjear ahora'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {/* ── Mis Canjes ── */}
            {tab === 'mis-canjes' && (
                <div className="ps-canjes" data-aos="fade-up">
                    {canjes.length === 0 ? (
                        <div className="ps-empty">
                            <div className="ps-empty-ico">📭</div>
                            <p>Aún no has canjeado ningún premio.</p>
                            <span>Ve a la tienda y canjea tus puntos</span>
                        </div>
                    ) : canjes.map((c, idx) => (
                        <div key={c.id_canje} className="ps-canje-item" data-aos="fade-up" data-aos-delay={idx * 40}>
                            <div className="ps-canje-ico">{estadoIcon[c.estado] ?? '🎁'}</div>
                            <div className="ps-canje-info">
                                <p className="ps-canje-nombre">{c.nombre_premio}</p>
                                {c.descripcion_premio && (
                                    <p className="ps-canje-desc">{c.descripcion_premio}</p>
                                )}
                                <p className="ps-canje-meta">
                                    {new Date(c.fecha_canje).toLocaleDateString('es-CO', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                    <span className="ps-canje-pts">{c.puntos_usados} pts</span>
                                </p>
                            </div>
                            <span
                                className="ps-estado-badge"
                                style={{ '--estado-color': estadoColor[c.estado] ?? '#fff' }}
                            >
                                {c.estado}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightbox && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.92)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'zoom-out',
                    }}
                    onClick={() => setLightbox(null)}
                >
                    <img
                        src={lightbox.src}
                        alt={lightbox.alt}
                        style={{
                            maxWidth: '90vw', maxHeight: '60vh',
                            objectFit: 'contain',
                            borderRadius: 8,
                            boxShadow: '0 8px 48px rgba(0,0,0,0.8)',
                            cursor: 'default',
                        }}
                        onClick={e => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', top: 20, right: 24,
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%', width: 40, height: 40,
                            color: '#fff', fontSize: 20, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
