import { useState, useRef } from 'react';
import { EmptyRow } from './shared';
import { API } from './constants';
import { useAdmin } from '../../../contexts/AdminContext';


// Todos los estados — solo para el formulario de creación
const ESTADOS_APUESTA = [
  { id_estado_apuesta: 1, nombre: 'CREADA' },
  { id_estado_apuesta: 2, nombre: 'ABIERTA' },
];

// En la tabla solo se puede mover entre CREADA y ABIERTA
const ESTADOS_GESTION = [
  { id_estado_apuesta: 1, nombre: 'CREADA' },
  { id_estado_apuesta: 2, nombre: 'ABIERTA' },
];

const FORM_INICIAL = {
  nombre: '',
  descripcion: '',
  reglas: '',
  id_tipo_puntuacion: '',
  id_estado_apuesta: '',
  fecha_inicio: '',
  fecha_fin: '',
};

const fmtDate = d => d ? String(d).split('T')[0] : '—';

export default function SeccionApuestas() {
  const {
    apuestas, setApuestas,
    equipos,
    punts: puntuaciones,
    catalogos,
    formA: form, setFormA: setForm,
    getHeaders,
    setApuestasVer,
  } = useAdmin();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [chipSearch, setChipSearch] = useState('');
  const [chipOpen, setChipOpen] = useState(false);
  const nombreRef = useRef(null);

  const handleChange = ({ target: { name, value } }) => setForm(p => ({ ...p, [name]: value }));

  const insertNombre = (texto) => {
    const el = nombreRef.current;
    if (!el) return;
    const start = el.selectionStart ?? form.nombre.length;
    const end   = el.selectionEnd   ?? form.nombre.length;
    const before = form.nombre.slice(0, start);
    const after  = form.nombre.slice(end);
    const needBefore = before.length > 0 && !before.endsWith(' ') && !texto.startsWith(' ');
    const needAfter  = after.length  > 0 && !after.startsWith(' ')  && !texto.endsWith(' ');
    const insert = (needBefore ? ' ' : '') + texto + (needAfter ? ' ' : '');
    setForm(p => ({ ...p, nombre: before + insert + after }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + insert.length, start + insert.length);
    }, 0);
  };

  const equiposFiltrados = chipSearch.trim()
    ? equipos.filter(e => e.nombre.toLowerCase().includes(chipSearch.toLowerCase())).slice(0, 8)
    : [];

  const handleSubmit = async e => {
    e.preventDefault();
    const { nombre, descripcion, reglas, id_tipo_puntuacion,
            id_estado_apuesta, fecha_inicio, fecha_fin } = form;

    setError('');

    if (!nombre.trim() || !descripcion.trim() || !reglas.trim() ||
        !id_tipo_puntuacion || !id_estado_apuesta || !fecha_inicio || !fecha_fin) {
      setError('Completa todos los campos antes de continuar.');
      return;
    }

    const dtInicio = new Date(fecha_inicio);
    const dtFin = new Date(fecha_fin);

    if (dtFin <= dtInicio) {
      const fmt = dt => dt.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: true });
      const mismodia = dtInicio.toDateString() === dtFin.toDateString();
      
      setError(mismodia
        ? `Mismo día: la hora de fin (${fmt(dtFin)}) debe ser mayor a la hora de inicio (${fmt(dtInicio)}).`
        : 'La fecha de fin debe ser posterior a la fecha de inicio.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res  = await fetch(`${API}/api/admin/apuestas`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();

      if (!res.ok) { 
        setError(data.message || 'Error al crear apuesta.'); 
        return;
      }
      
      setApuestas(prev => [...prev, data]);
      setForm(FORM_INICIAL);
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const cambiarEstado = async (id, id_estado_apuesta, nombreEstado) => {
    const estadoAnterior = apuestas.find(a => a.id_apuesta === id)?.estado;

    setApuestas(prev => prev.map(a => a.id_apuesta === id ? { ...a, estado: nombreEstado } : a));

    try {
      const res = await fetch(`${API}/api/admin/apuestas/${id}/estado`, {
        method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ id_estado_apuesta }),
      });
      if (!res.ok) {
        setApuestas(prev => prev.map(a => a.id_apuesta === id ? { ...a, estado: estadoAnterior } : a));
      }
    } catch {
      setApuestas(prev => prev.map(a => a.id_apuesta === id ? { ...a, estado: estadoAnterior } : a));
    }
  };

  const eliminar = async id => {
    const res = await fetch(`${API}/api/admin/apuestas/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) {
      setApuestas(prev => prev.filter(a => a.id_apuesta !== id));
      setApuestasVer(v => v + 1);
    }
  };

  return (
    <div className="seccion">

      {/* ── Formulario arriba ── */}
      <div className="form-card" style={{ marginBottom: 20 }}>
        <h2 className="section-title">Nueva Apuesta</h2>
        <form className="admin-form" onSubmit={handleSubmit} autoComplete='off'>

          <div className="apuesta-form-grid">
            {/* Nombre — fila completa con selector de equipos */}
            <div className="form-group apuesta-col-full">
              <label>Nombre</label>
              <input
                ref={nombreRef}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juego de hoy..."
              />
              <div className="team-input-wrap" style={{ marginTop: 6 }}>
                <input
                  className="nombre-chip-search"
                  style={{ width: '100%' }}
                  placeholder="Buscar equipo para insertar..."
                  value={chipSearch}
                  autoComplete="off"
                  onChange={e => { setChipSearch(e.target.value); setChipOpen(true); }}
                  onFocus={() => setChipOpen(true)}
                  onBlur={() => setTimeout(() => setChipOpen(false), 150)}
                />
                {chipOpen && equiposFiltrados.length > 0 && (
                  <ul className="team-dropdown">
                    {equiposFiltrados.map(e => (
                      <li key={e.id_equipo} onMouseDown={() => { insertNombre(e.nombre); setChipSearch(''); setChipOpen(false); }}>
                        {e.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group apuesta-col-full" style={{ gridColumn: 'span 2' }}>
              <label>Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción de la apuesta..." rows={2} />
            </div>

            {/* Reglas */}
            <div className="form-group" style={{ gridColumn: 'span 1' }}>
              <label>Reglas</label>
              <textarea name="reglas" value={form.reglas} onChange={handleChange} placeholder="Reglas del concurso..." rows={2} />
            </div>

            {/* Tipo de Puntuación */}
            <div className="form-group">
              <label>Tipo de Puntuación</label>
              <select name="id_tipo_puntuacion" value={form.id_tipo_puntuacion} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {puntuaciones.map(p => <option key={p.id_tipo_puntuacion} value={p.id_tipo_puntuacion}>{p.nombre}</option>)}
              </select>
            </div>

            {/* Estado */}
            <div className="form-group">
              <label>Estado</label>
              <select name="id_estado_apuesta" value={form.id_estado_apuesta} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {ESTADOS_APUESTA.map(e => <option key={e.id_estado_apuesta} value={e.id_estado_apuesta}>{e.nombre}</option>)}
              </select>
            </div>

            {/* Fecha inicio */}
            <div className="form-group">
              <label>Fecha inicio</label>
              <input name="fecha_inicio" type="datetime-local" value={form.fecha_inicio} onChange={handleChange} />
            </div>

            {/* Fecha fin */}
            <div className="form-group">
              <label>Fecha fin</label>
              <input name="fecha_fin" type="datetime-local" value={form.fecha_fin} onChange={handleChange} />
            </div>

            {/* Error + Botón */}
            <div className="form-group apuesta-submit-wrap">
              {error && <p className="form-error">{error}</p>}
              <button className="form-submit" type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear apuesta'}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* ── Tabla abajo ── */}
      <div className="list-card">
        <h2 className="section-title">Apuestas creadas</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Tipo</th><th>Estado</th><th>Cambiar estado</th><th>Inicio</th><th>Fin</th><th></th></tr>
            </thead>
            <tbody>
              {apuestas.map((a, i) => (
                <tr key={a.id_apuesta}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-bold">{a.nombre}</td>
                  <td className="td-muted">{a.tipo_puntuacion}</td>
                  <td><span className="estado-apuesta">{a.estado}</span></td>
                  <td>
                    {['CREADA', 'ABIERTA'].includes(a.estado) ? (
                      <select
                        className="estado-select"
                        value={ESTADOS_GESTION.find(e => e.nombre === a.estado)?.id_estado_apuesta ?? ''}
                        onChange={ev => {
                          const sel = ESTADOS_GESTION.find(e => e.id_estado_apuesta === Number(ev.target.value));
                          if (sel) cambiarEstado(a.id_apuesta, sel.id_estado_apuesta, sel.nombre);
                        }}
                      >
                        {ESTADOS_GESTION.map(e => (
                          <option key={e.id_estado_apuesta} value={e.id_estado_apuesta}>{e.nombre}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="finalizada-lock">Gestionar en Resultados</span>
                    )}
                  </td>
                  <td className="td-muted">{fmtDate(a.fecha_inicio)}</td>
                  <td className="td-muted">{fmtDate(a.fecha_fin)}</td>
                  <td>
                    <button
                      className="act-btn reject"
                      onClick={() => eliminar(a.id_apuesta)}
                      disabled={a.estado === 'FINALIZADA'}
                      title={a.estado === 'FINALIZADA' ? 'No se puede eliminar una apuesta finalizada' : ''}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {apuestas.length === 0 && <EmptyRow cols={7} msg="Sin apuestas creadas" />}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
