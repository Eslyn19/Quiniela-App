import { useState } from 'react';
import { API } from './constants';
import { useAdmin } from '../../../contexts/AdminContext';

const TIPOS_INFO = {
    'Marcador exacto':
        'Escalonado — Exacto (local+visitante): base×mult | Ganador correcto (score errado): base | Incorrecto: −pen. El acierto parcial siempre supera al tipo Resultado.',
    'Resultado (Victoria/Empate/Derrota)':
        'Victoria local, empate o victoria visitante. Correcto: base×mult | Incorrecto: −pen.',
    'Primer goleador':
        'El equipo con más goles se toma como primer anotador. Correcto: base×mult | Empate (sin anotador) o fallo: −pen.',
    'Mas o menos goles':
        'Umbral de 2.5 goles totales. Si la suma pronosticada y la real coinciden en superar o no ese umbral: base×mult | Fallo: −pen.',
    'Ganador del torneo':
        'El equipo representado como "local" del evento es el campeón predicho. Correcto: base×mult | Incorrecto: −pen.',
};

export default function SeccionPuntuaciones() {
  const { punts: puntuaciones, setPunts: setPuntuaciones, getHeaders } = useAdmin();
    const [editMap, setEditMap] = useState({});
    const [savingMap, setSavingMap] = useState({});
    const [feedbackMap, setFeedbackMap] = useState({});

    const initEdit = (p) => {
        setEditMap(prev => ({
            ...prev,
            [p.id_tipo_puntuacion]: {
                puntos_base: String(p.puntos_base),
                multiplicador: String(p.multiplicador),
                penalizacion: String(p.penalizacion),
            },
        }));
    };

    const handleChange = (id, field, value) => {
        setEditMap(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const guardar = async (id) => {
        const vals = editMap[id];
        if (!vals) return;

        setSavingMap(prev => ({ ...prev, [id]: true }));
        setFeedbackMap(prev => ({ ...prev, [id]: null }));

        try {
            const res = await fetch(`${API}/api/admin/puntuaciones/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({
                    puntos_base: parseFloat(vals.puntos_base),
                    multiplicador: parseFloat(vals.multiplicador),
                    penalizacion: parseFloat(vals.penalizacion),
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setPuntuaciones(prev =>
                    prev.map(p => p.id_tipo_puntuacion === id ? { ...p, ...data } : p)
                );
                setEditMap(prev => { const n = { ...prev }; delete n[id]; return n; });
                setFeedbackMap(prev => ({ ...prev, [id]: 'ok' }));
            } else {
                setFeedbackMap(prev => ({ ...prev, [id]: data.message || 'Error' }));
            }
        } catch {
            setFeedbackMap(prev => ({ ...prev, [id]: 'Error de conexión' }));
        } finally {
            setSavingMap(prev => ({ ...prev, [id]: false }));
            setTimeout(() => setFeedbackMap(prev => ({ ...prev, [id]: null })), 2500);
        }
    };

    return (
        <div className="seccion">
            <h2 className="section-title">Tipos de Puntuación</h2>

            <div className="punt-grid">
                {puntuaciones.map(p => {
                    const editing = editMap[p.id_tipo_puntuacion];
                    const saving = savingMap[p.id_tipo_puntuacion];
                    const fb = feedbackMap[p.id_tipo_puntuacion];

                    return (
                        <div key={p.id_tipo_puntuacion} className="punt-card">
                            <div className="punt-card-header">
                                <span className="punt-nombre">{p.nombre}</span>
                            </div>
                            <p className="punt-desc">{TIPOS_INFO[p.nombre] ?? ''}</p>

                            {!editing ? (
                                <>
                                    <div className="punt-values">
                                        <div className="punt-val-item">
                                            <span className="punt-val-label">Pts base</span>
                                            <span className="punt-val-num">{parseFloat(p.puntos_base).toFixed(2)}</span>
                                        </div>
                                        <div className="punt-val-item">
                                            <span className="punt-val-label">Multiplicador</span>
                                            <span className="punt-val-num">{parseFloat(p.multiplicador).toFixed(2)}</span>
                                        </div>
                                        <div className="punt-val-item">
                                            <span className="punt-val-label">Penalización</span>
                                            <span className="punt-val-num">{parseFloat(p.penalizacion).toFixed(2)}</span>
                                        </div>
                                        <div className="punt-val-item">
                                            <span className="punt-val-label">Pts correctos</span>
                                            <span className="punt-val-num" style={{ color: '#6bff95' }}>
                                                {(parseFloat(p.puntos_base) * parseFloat(p.multiplicador)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="act-btn approve punt-edit-btn" onClick={() => initEdit(p)}>
                                        Editar
                                    </button>
                                </>
                            ) : (
                                <div className="punt-edit-form">
                                    <div className="punt-edit-row">
                                        <div className="form-group">
                                            <label>Pts base</label>
                                            <input
                                                type="number" step="0.01" min="0"
                                                value={editing.puntos_base}
                                                onChange={e => handleChange(p.id_tipo_puntuacion, 'puntos_base', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Multiplicador</label>
                                            <input
                                                type="number" step="0.01" min="0"
                                                value={editing.multiplicador}
                                                onChange={e => handleChange(p.id_tipo_puntuacion, 'multiplicador', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Penalización</label>
                                            <input
                                                type="number" step="0.01" min="0"
                                                value={editing.penalizacion}
                                                onChange={e => handleChange(p.id_tipo_puntuacion, 'penalizacion', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="punt-edit-actions">
                                        <button
                                            className="form-submit punt-save-btn"
                                            onClick={() => guardar(p.id_tipo_puntuacion)}
                                            disabled={saving}
                                        >
                                            {saving ? 'Guardando...' : 'Guardar'}
                                        </button>
                                        <button
                                            className="act-btn reject"
                                            onClick={() => setEditMap(prev => { const n = { ...prev }; delete n[p.id_tipo_puntuacion]; return n; })}
                                        >
                                            Cancelar
                                        </button>
                                        {fb && fb !== 'ok' && <span className="form-error">{fb}</span>}
                                        {fb === 'ok' && <span style={{ color: '#6bff95', fontSize: '0.78rem' }}>✓ Guardado</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
