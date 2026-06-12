import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { EstadoBadge, EmptyState } from './shared';
import { API } from './constants';

const fmtDate = d => d ? String(d).split('T')[0] : '—';
const FILTROS = ['TODAS', 'ABIERTAS', 'PARTICIPANDO', 'CERRADAS', 'FINALIZADAS'];
const PRONO_VACIO = { local: '', visitante: '' };

function ModalReglas({ apuesta, onAceptar, onClose }) {
    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) onClose();
    }, [onClose]);

    return createPortal(
        <div className="sug-overlay" onClick={handleOverlayClick}>
            <div className="ev-modal" style={{ maxWidth: 480 }}>
                <div className="ev-modal-header">
                    <div className="ev-modal-title-group">
                        <h3 className="ev-modal-title">Reglas de la apuesta</h3>
                        <p className="ev-modal-sub">{apuesta.nombre}</p>
                    </div>
                    <button className="sug-close" onClick={onClose}>✕</button>
                </div>
                <div className="ev-modal-body">
                    <p className="rules-text">{apuesta.reglas}</p>
                </div>
                <div className="rules-modal-footer">
                    <button className="rules-cancel-btn" onClick={onClose}>Cancelar</button>
                    <button className="rules-accept-btn" onClick={onAceptar}>
                        Acepto, unirme →
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function ModalEventos({ apuesta, isJoined, getHeaders, onClose, initialTab }) {
    const [tab, setTab] = useState(initialTab);

    const [eventos, setEventos]         = useState(null);
    const [errEv, setErrEv]             = useState(null);
    const [pronosticos, setPronosticos] = useState({});
    const [saving, setSaving]           = useState({});
    const [feedback, setFeedback]       = useState({});

    const [participantes, setParticipantes] = useState(null);
    const [errP, setErrP]                   = useState(null);

    useEffect(() => {
        if (tab !== 'eventos' || !isJoined) return;
        let cancelled = false;
        const load = async () => {
            try {
                const res  = await fetch(`${API}/api/player/apuestas/${apuesta.id_apuesta}/eventos`, { headers: getHeaders() });
                
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                
                const data = await res.json();
                if (cancelled) 
                    return;
                if (!res.ok) { 
                    setErrEv(data.message ?? 'Error al cargar eventos'); 
                    return; 
                }
                
                const lista = Array.isArray(data) ? data : [];
                setEventos(lista);
                const vals = {};
                lista.forEach(ev => {
                    vals[ev.id_evento] = {
                        local:     ev.prono_local     != null ? String(ev.prono_local)     : '',
                        visitante: ev.prono_visitante != null ? String(ev.prono_visitante) : '',
                    };
                });
                setPronosticos(vals);
            } catch {
                if (!cancelled) setErrEv('Error de conexión');
            }
        };
        load();
        return () => { cancelled = true; };
    }, [apuesta.id_apuesta, tab, isJoined]);

    useEffect(() => {
        if (tab !== 'participantes') 
            return;
        let cancelled = false;
        const load = async () => {
            try {
                const res  = await fetch(`${API}/api/player/apuestas/${apuesta.id_apuesta}/participantes`, { headers: getHeaders() });
                const data = await res.json();
                if (cancelled) 
                    return;
                
                if (!res.ok) { 
                    setErrP(data.message ?? 'Error al cargar participantes'); 
                    return; 
                }
                setParticipantes(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) setErrP('Error de conexión');
            }
        };
        load();
        return () => { cancelled = true; };
    }, [apuesta.id_apuesta, tab]);

    const setProno = (id_evento, field, value) => {
        setPronosticos(prev => ({
            ...prev,
            [id_evento]: { ...(prev[id_evento] ?? PRONO_VACIO), [field]: value },
        }));
    };

    const guardar = async (id_evento) => {
        const prono = pronosticos[id_evento] ?? PRONO_VACIO;
        if (prono.local === '' || prono.visitante === '') return;

        setSaving(prev => ({ ...prev, [id_evento]: true }));
        setFeedback(prev => ({ ...prev, [id_evento]: null }));

        try {
            const res  = await fetch(`${API}/api/player/eventos/${id_evento}/pronostico`, {
                method: 'POST', headers: getHeaders(),
                body: JSON.stringify({
                    pts_local:     Number(prono.local),
                    pts_visitante: Number(prono.visitante),
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setEventos(prev => prev.map(ev =>
                    ev.id_evento === id_evento
                        ? { ...ev, prono_local: Number(prono.local), prono_visitante: Number(prono.visitante), id_pronostico: data.id_pronostico ?? ev.id_pronostico ?? id_evento }
                        : ev
                ));
            } else {
                setFeedback(prev => ({ ...prev, [id_evento]: { ok: false, msg: data.message } }));
            }
        } catch {
            setFeedback(prev => ({ ...prev, [id_evento]: { ok: false, msg: 'Error de conexión' } }));
        } finally {
            setSaving(prev => ({ ...prev, [id_evento]: false }));
        }
    };

    const isOpen = apuesta.estado === 'ABIERTA';

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) onClose();
    }, [onClose]);

    return createPortal(
        <div className="sug-overlay" onClick={handleOverlayClick}>
            <div className="ev-modal">
                <div className="ev-modal-header">
                    <div className="ev-modal-title-group">
                        <EstadoBadge estado={apuesta.estado} />
                        <h3 className="ev-modal-title">{apuesta.nombre}</h3>
                        <p className="ev-modal-sub">{apuesta.deporte} · {apuesta.tipo_puntuacion}</p>
                    </div>
                    <button className="sug-close" onClick={onClose}>✕</button>
                </div>

                <div className="ev-modal-tabs">
                    {isJoined && (
                        <button
                            className={`ev-modal-tab-btn${tab === 'eventos' ? ' active' : ''}`}
                            onClick={() => setTab('eventos')}
                        >
                            Eventos
                        </button>
                    )}
                    <button
                        className={`ev-modal-tab-btn${tab === 'participantes' ? ' active' : ''}`}
                        onClick={() => setTab('participantes')}
                    >
                        Participantes
                    </button>
                </div>

                <div className="ev-modal-body">

                    {tab === 'eventos' && !isJoined && (
                        <p className="bet-eventos-loading">Únete a esta apuesta para ver los eventos.</p>
                    )}

                    {tab === 'eventos' && isJoined && (
                        <>
                            {eventos === null && !errEv && (
                                <p className="bet-eventos-loading">Cargando eventos...</p>
                            )}
                            {errEv && (
                                <p className="bet-eventos-loading" style={{ color: '#f87171' }}>{errEv}</p>
                            )}
                            {eventos !== null && !errEv && eventos.length === 0 && (
                                <p className="bet-eventos-loading">Sin eventos registrados.</p>
                            )}
                            {eventos !== null && !errEv && eventos.length > 0 && (
                                <div className="bet-eventos-list">
                                    {eventos.map(ev => {
                                        const prono = pronosticos[ev.id_evento] ?? PRONO_VACIO;
                                        const fb    = feedback[ev.id_evento];
                                        const yaGuardado      = ev.id_pronostico != null;
                                        const eventoInicio    = ev.fecha ? new Date(ev.fecha) : null;
                                        const eventoYaComenzo = eventoInicio && eventoInicio <= new Date();
                                        const canEdit = isOpen && !yaGuardado && !eventoYaComenzo;

                                        return (
                                            <div key={ev.id_evento} className="evento-row">
                                                <div className="evento-info">
                                                    <span className="evento-nombre">
                                                        {ev.equipo_local && ev.equipo_visitante
                                                            ? `${ev.equipo_local} vs ${ev.equipo_visitante}`
                                                            : ev.nombre
                                                        }
                                                    </span>
                                                    <span className="evento-fecha">{fmtDate(ev.fecha)}</span>
                                                    {ev.resultado_oficial && (
                                                        <span className="evento-resultado">
                                                            Resultado oficial: <strong>{ev.resultado_oficial}</strong>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="evento-pronostico">
                                                    {canEdit ? (
                                                        <>
                                                            <div className="prono-score-group">
                                                                <label className="prono-score-label">Local</label>
                                                                <input
                                                                    className="pronostico-input score-input"
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="0"
                                                                    value={prono.local}
                                                                    onChange={e => setProno(ev.id_evento, 'local', e.target.value)}
                                                                />
                                                            </div>
                                                            <span className="prono-vs">vs</span>
                                                            <div className="prono-score-group">
                                                                <label className="prono-score-label">Visitante</label>
                                                                <input
                                                                    className="pronostico-input score-input"
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="0"
                                                                    value={prono.visitante}
                                                                    onChange={e => setProno(ev.id_evento, 'visitante', e.target.value)}
                                                                />
                                                            </div>
                                                            <button
                                                                className="pronostico-save-btn"
                                                                onClick={() => guardar(ev.id_evento)}
                                                                disabled={saving[ev.id_evento] || prono.local === '' || prono.visitante === ''}
                                                            >
                                                                {saving[ev.id_evento] ? '...' : 'Guardar'}
                                                            </button>
                                                            {fb && (
                                                                <span className={`pronostico-fb${fb.ok ? ' ok' : ' err'}`}>
                                                                    {fb.msg}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="pronostico-locked">
                                                            {yaGuardado ? (
                                                                <>
                                                                    <span className="prono-locked-score">
                                                                        <span className="prono-locked-label">Local</span>
                                                                        <strong>{ev.prono_local}</strong>
                                                                    </span>
                                                                    <span className="prono-locked-vs">vs</span>
                                                                    <span className="prono-locked-score">
                                                                        <span className="prono-locked-label">Visitante</span>
                                                                        <strong>{ev.prono_visitante}</strong>
                                                                    </span>
                                                                    <span className="prono-locked-badge">Registrado</span>
                                                                </>
                                                            ) : eventoYaComenzo ? (
                                                                <span className="pronostico-readonly"><em>Evento ya comenzó</em></span>
                                                            ) : (
                                                                <span className="pronostico-readonly"><em>Sin pronóstico</em></span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {tab === 'participantes' && (
                        <>
                            {participantes === null && !errP && (
                                <p className="bet-eventos-loading">Cargando participantes...</p>
                            )}
                            {errP && (
                                <p className="bet-eventos-loading" style={{ color: '#f87171' }}>{errP}</p>
                            )}
                            {participantes !== null && !errP && participantes.length === 0 && (
                                <p className="bet-eventos-loading">Aún no hay participantes.</p>
                            )}
                            {participantes !== null && !errP && participantes.length > 0 && (
                                <div className="participantes-list">
                                    {participantes.map((p, i) => (
                                        <div key={p.username} className="participante-row">
                                            <div className="participante-info">
                                                <span className="participante-nombre">{p.nombre}</span>
                                                <span className="participante-username">@{p.username}</span>
                                            </div>
                                            {p.puntos != null && (
                                                <span className="participante-puntos">
                                                    {Number(p.puntos).toFixed(2)} pts
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
}

export default function SeccionApuestas({ apuestas, setApuestas, getHeaders }) {
    const [filtro, setFiltro]         = useState('TODAS');
    const [modal, setModal]           = useState(null);
    const [rulesModal, setRulesModal] = useState(null);
    const [joining, setJoining]       = useState(null);

    const filtradas = apuestas.filter(a => {
        if (filtro === 'TODAS')        return true;
        if (filtro === 'ABIERTAS')     return a.estado === 'ABIERTA';
        if (filtro === 'PARTICIPANDO') return !!a.ya_unido;
        if (filtro === 'CERRADAS')     return a.estado === 'CERRADA';
        if (filtro === 'FINALIZADAS')  return a.estado === 'FINALIZADA';
        return true;
    });

    const confirmarUnirse = async (id_apuesta) => {
        setRulesModal(null);
        setJoining(id_apuesta);
        try {
            const res = await fetch(`${API}/api/player/apuestas/${id_apuesta}/unirse`, {
                method: 'POST', headers: getHeaders(),
            });
            if (res.ok) {
                setApuestas(prev => prev.map(a =>
                    a.id_apuesta === id_apuesta ? { ...a, ya_unido: 1, mis_puntos: 0 } : a
                ));
            }
        } finally {
            setJoining(null);
        }
    };

    const apuestaModal = modal !== null ? apuestas.find(a => a.id_apuesta === modal.id) : null;

    return (
        <div className="player-seccion">

            {apuestaModal && (
                <ModalEventos
                    apuesta={apuestaModal}
                    isJoined={!!apuestaModal.ya_unido}
                    getHeaders={getHeaders}
                    onClose={() => setModal(null)}
                    initialTab={modal.tab}
                />
            )}

            {rulesModal && (
                <ModalReglas
                    apuesta={rulesModal}
                    onAceptar={() => confirmarUnirse(rulesModal.id_apuesta)}
                    onClose={() => setRulesModal(null)}
                />
            )}

            <div data-aos="fade-down">
                <h2 className="player-section-title">Mis Apuestas</h2>
                <p className="player-section-sub">Participa, predice y compite</p>
            </div>

            <div className="player-filter-tabs" data-aos="fade-up" data-aos-delay="60">
                {FILTROS.map(f => (
                    <button
                        key={f}
                        className={`player-filter-tab${filtro === f ? ' active' : ''}`}
                        onClick={() => setFiltro(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bet-grid">
                {filtradas.length === 0 && (
                    <div data-aos="fade-up">
                        <EmptyState msg="No hay apuestas con este filtro." />
                    </div>
                )}

                {filtradas.map((a, i) => {
                    const yaComenzo = new Date(a.fecha_inicio) <= new Date();
                    const isOpen    = a.estado === 'ABIERTA';
                    const isJoined  = !!a.ya_unido;
                    const canJoin   = isOpen && !isJoined && !yaComenzo;

                    const horaInicio = new Date(a.fecha_inicio).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    });

                    return (
                        <div
                            key={a.id_apuesta}
                            className="bet-card"
                            data-aos="fade-up"
                            data-aos-delay={i * 60}
                        >
                            <div className="bet-card-top">
                                <div className="bet-card-meta">
                                    <EstadoBadge estado={a.estado} />
                                    {isJoined && (
                                        <span className="bet-participando-badge">
                                            {a.mis_puntos != null
                                                ? `${Number(a.mis_puntos).toFixed(2)} pts`
                                                : 'Participando'
                                            }
                                        </span>
                                    )}
                                </div>
                                <h3 className="bet-card-nombre">{a.nombre}</h3>
                                <p className="bet-card-deporte">{a.deporte} · {a.tipo_puntuacion}</p>
                                <p className="bet-card-fechas">
                                    Comienza: {fmtDate(a.fecha_inicio)} · {horaInicio} hs
                                </p>
                                <p className="bet-card-desc">{a.descripcion}</p>
                                {a.estado === 'FINALIZADA' && a.resultado_oficial && (
                                    <p className="bet-card-resultado">
                                        Resultado: <strong>{a.resultado_oficial}</strong>
                                    </p>
                                )}

                                <div className="bet-card-actions">
                                    {canJoin && (
                                        <button
                                            className="bet-join-btn"
                                            onClick={() => setRulesModal(a)}
                                            disabled={joining === a.id_apuesta}
                                        >
                                            {joining === a.id_apuesta ? 'Uniéndose...' : 'Unirse →'}
                                        </button>
                                    )}
                                    {isOpen && !isJoined && yaComenzo && (
                                        <span className="pronostico-readonly"><em>Apuesta ya comenzó</em></span>
                                    )}
                                    {isJoined && (
                                        <button
                                            className="bet-expand-btn"
                                            onClick={() => setModal({ id: a.id_apuesta, tab: 'eventos' })}
                                        >
                                            Ver eventos →
                                        </button>
                                    )}
                                    <button
                                        className="bet-participants-btn"
                                        onClick={() => setModal({ id: a.id_apuesta, tab: 'participantes' })}
                                    >
                                        Participantes
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
