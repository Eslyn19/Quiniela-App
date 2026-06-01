import { useState, useEffect, useCallback } from 'react';
import { API } from './constants';
import { useAdmin } from '../../../contexts/AdminContext';

const ESTADOS_RESULTADO = [
  { id: 3, nombre: 'CERRADA'    },
  { id: 4, nombre: 'FINALIZADA' },
];

function TeamInput({ value, disabled, onChange }) {
  const { equipos } = useAdmin();
  const [open, setOpen] = useState(false);

  const sugerencias = value.trim().length > 0
    ? equipos.filter(e => e.nombre.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="team-input-wrap">
      <input
        className="form-mini-input resultado-team-input"
        placeholder="Buscar equipo..."
        value={value}
        disabled={disabled}
        autoComplete="off"
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && sugerencias.length > 0 && (
        <ul className="team-dropdown">
          {sugerencias.map(e => (
            <li
              key={e.id_equipo}
              onMouseDown={() => { onChange(e.nombre); setOpen(false); }}
            >
              {e.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SeccionResultados() {
  const { getHeaders, apuestasVer: refreshKey, setApuestas: setApuestasCtx } = useAdmin();
  const [apuestas, setApuestas]       = useState([]);
  const [formsMap, setFormsMap]       = useState({});
  const [savingMap, setSavingMap]     = useState({});
  const [feedbackMap, setFeedbackMap] = useState({});
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res  = await fetch(`${API}/api/admin/resultados`, { headers: getHeaders() });
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];
      setApuestas(lista);

      const forms = {};
      lista.forEach(a => {
        forms[a.id_apuesta] = {
          local:           a.pts_local     != null ? String(a.pts_local)     : '',
          visitante:       a.pts_visitante != null ? String(a.pts_visitante) : '',
          equipoLocal:     '',
          equipoVisitante: '',
        };
      });
      setFormsMap(forms);
    } catch {
      setFetchError(true);
    }
    setLoading(false);
  }, [getHeaders]);

  useEffect(() => { cargar(); }, [refreshKey]);

  const handleChange = (id_apuesta, field, value) =>
    setFormsMap(prev => ({ ...prev, [id_apuesta]: { ...prev[id_apuesta], [field]: value } }));

  const guardar = async (id_apuesta) => {
    const f = formsMap[id_apuesta] || {};
    if (f.local === '' || f.visitante === '') return;

    setSavingMap(prev => ({ ...prev, [id_apuesta]: true }));
    setFeedbackMap(prev => ({ ...prev, [id_apuesta]: null }));

    try {
      const res = await fetch(`${API}/api/admin/resultados/apuesta/${id_apuesta}/resultado`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({
          pts_local:        Number(f.local),
          pts_visitante:    Number(f.visitante),
          equipo_local:     f.equipoLocal    || '',
          equipo_visitante: f.equipoVisitante || '',
        }),
      });
      setFeedbackMap(prev => ({ ...prev, [id_apuesta]: res.ok ? 'ok' : 'err' }));
    } catch {
      setFeedbackMap(prev => ({ ...prev, [id_apuesta]: 'err' }));
    }

    setSavingMap(prev => ({ ...prev, [id_apuesta]: false }));
    setTimeout(() => setFeedbackMap(prev => ({ ...prev, [id_apuesta]: null })), 2500);
  };

  const cambiarEstado = async (id_apuesta, id_estado_apuesta, nombre) => {
    const prev_estado = apuestas.find(a => a.id_apuesta === id_apuesta)?.estado;
    const aplicar  = () => {
      setApuestas(p => p.map(a => a.id_apuesta === id_apuesta ? { ...a, estado: nombre, id_estado_apuesta } : a));
      setApuestasCtx(p => p.map(a => a.id_apuesta === id_apuesta ? { ...a, estado: nombre } : a));
    };
    const revertir = () => {
      setApuestas(p => p.map(a => a.id_apuesta === id_apuesta ? { ...a, estado: prev_estado } : a));
      setApuestasCtx(p => p.map(a => a.id_apuesta === id_apuesta ? { ...a, estado: prev_estado } : a));
    };
    aplicar();
    try {
      const res = await fetch(`${API}/api/admin/resultados/apuesta/${id_apuesta}/estado`, {
        method: 'PATCH', headers: getHeaders(),
        body: JSON.stringify({ id_estado_apuesta }),
      });
      if (!res.ok) revertir();
    } catch { revertir(); }
  };

  if (loading) return (
    <div className="seccion">
      <div className="list-card"><p className="eventos-loading">Cargando apuestas...</p></div>
    </div>
  );

  if (fetchError) return (
    <div className="seccion">
      <div className="list-card" style={{ textAlign: 'center' }}>
        <p className="eventos-loading">No se pudo conectar con el servidor.</p>
        <button className="act-btn approve" onClick={cargar}>Reintentar</button>
      </div>
    </div>
  );

  if (apuestas.length === 0) return (
    <div className="seccion">
      <div className="list-card"><p className="eventos-loading">Sin apuestas registradas.</p></div>
    </div>
  );

  return (
    <div className="seccion">
      <h2 className="section-title">Resultados de Apuestas</h2>

      {apuestas.map(a => {
        const f           = formsMap[a.id_apuesta] || { local: '', visitante: '', equipoLocal: '', equipoVisitante: '' };
        const puedeEditar = a.estado === 'CERRADA';
        const busy        = !!savingMap[a.id_apuesta];
        const listo       = f.local !== '' && f.visitante !== '';
        const fb          = feedbackMap[a.id_apuesta];

        return (
          <div key={a.id_apuesta} className="list-card resultado-card">

            {/* Cabecera */}
            <div className="resultado-apuesta-header">
              <span className="resultado-apuesta-nombre">{a.nombre}</span>
              <div className="resultado-apuesta-controls">
                <span className="estado-apuesta">{a.estado}</span>
                {a.estado !== 'FINALIZADA' && (
                  <select
                    className="estado-select"
                    defaultValue=""
                    onChange={ev => {
                      const sel = ESTADOS_RESULTADO.find(e => e.id === Number(ev.target.value));
                      if (sel) cambiarEstado(a.id_apuesta, sel.id, sel.nombre);
                    }}
                  >
                    <option value="" disabled>Cambiar estado...</option>
                    {ESTADOS_RESULTADO.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Equipos */}
            <div className="resultado-teams-row">
              <div className="resultado-team-group">
                <label className="resultado-score-label">Equipo local</label>
                <TeamInput
                  value={f.equipoLocal}
                  disabled={!puedeEditar}
                  onChange={v => handleChange(a.id_apuesta, 'equipoLocal', v)}
                />
              </div>
              <span className="resultado-vs">vs</span>
              <div className="resultado-team-group">
                <label className="resultado-score-label">Equipo visitante</label>
                <TeamInput
                  value={f.equipoVisitante}
                  disabled={!puedeEditar}
                  onChange={v => handleChange(a.id_apuesta, 'equipoVisitante', v)}
                />
              </div>
            </div>

            {/* Marcador */}
            <div className="resultado-scores-row">
              <div className="resultado-score-group">
                <label className="resultado-score-label">Goles local</label>
                <input
                  className="form-mini-input resultado-score-input"
                  type="number" min="0" placeholder="0"
                  value={f.local}
                  disabled={!puedeEditar}
                  onChange={e => handleChange(a.id_apuesta, 'local', e.target.value)}
                />
              </div>
              <span className="resultado-vs">—</span>
              <div className="resultado-score-group">
                <label className="resultado-score-label">Goles visitante</label>
                <input
                  className="form-mini-input resultado-score-input"
                  type="number" min="0" placeholder="0"
                  value={f.visitante}
                  disabled={!puedeEditar}
                  onChange={e => handleChange(a.id_apuesta, 'visitante', e.target.value)}
                />
              </div>
              <div className="resultado-save-wrap">
                <button
                  className="act-btn approve"
                  disabled={busy || !listo || !puedeEditar}
                  onClick={() => guardar(a.id_apuesta)}
                >
                  {busy ? 'Guardando...' : 'Guardar'}
                </button>
                {fb === 'ok'  && <span className="resultado-fb ok">✓ Guardado</span>}
                {fb === 'err' && <span className="resultado-fb err">✗ Error</span>}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
