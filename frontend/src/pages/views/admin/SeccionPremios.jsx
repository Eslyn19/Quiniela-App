import { useState, useRef } from 'react';
import { API } from './constants';
import { EmptyRow } from './shared';
import { useAdmin } from '../../../contexts/AdminContext';

const ESTADOS_CANJE = ['PENDIENTE', 'ENTREGADO', 'RECHAZADO'];
const estadoColor   = { PENDIENTE: '#f59e0b', ENTREGADO: '#22c55e', RECHAZADO: '#ef4444' };

const emptyForm = { nombre: '', descripcion: '', costo_puntos: '', stock: '', fecha_inicio: '', fecha_fin: '', imagen_url: '' };

export default function SeccionPremios() {
  const { getHeaders, premios, setPremios, canjes, setCanjes } = useAdmin();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('premios');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const resetForm = () => { 
    setForm(emptyForm); 
    setEditId(null); 
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) 
      return;
    setUploading(true);
    
    try {
      const fd = new FormData();
      fd.append('imagen', file);
      const res  = await fetch(`${API}/api/admin/upload/premio-imagen`, { method: 'POST', headers: { Authorization: getHeaders().Authorization }, body: fd });
      const data = await res.json();
      
      if (!res.ok) { 
        alert(data.message); 
        return; 
      }
      setForm(p => ({ ...p, imagen_url: data.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.descripcion.trim() || !form.costo_puntos) return;
    setSaving(true);
    try {
      const url    = editId ? `${API}/api/admin/premios/${editId}` : `${API}/api/admin/premios`;
      const method = editId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          nombre:       form.nombre.trim(),
          descripcion:  form.descripcion.trim(),
          costo_puntos: Number(form.costo_puntos),
          stock:        form.stock !== '' ? Number(form.stock) : null,
          fecha_inicio: form.fecha_inicio || null,
          fecha_fin:    form.fecha_fin    || null,
          imagen_url:   form.imagen_url   || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      if (editId) setPremios(prev => prev.map(p => p.id_premio === editId ? data : p));
      else        setPremios(prev => [...prev, data]);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id_premio);
    setForm({
      nombre:       p.nombre,
      descripcion:  p.descripcion,
      costo_puntos: p.costo_puntos,
      stock:        p.stock ?? '',
      fecha_inicio: p.fecha_inicio ?? '',
      fecha_fin:    p.fecha_fin    ?? '',
      imagen_url:   p.imagen_url   ?? '',
    });
  };

  const handleToggleActivo = async (p) => {
    const res = await fetch(`${API}/api/admin/premios/${p.id_premio}`, {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ activo: !p.activo }),
    });
    if (!res.ok) { 
      const d = await res.json(); 
      alert(d.message); 
      return; 
    }
    setPremios(prev => prev.map(x => x.id_premio === p.id_premio ? { ...x, activo: !p.activo } : x));
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este premio?')) return;
    const res = await fetch(`${API}/api/admin/premios/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) { const d = await res.json(); alert(d.message); return; }
    setPremios(prev => prev.filter(p => p.id_premio !== id));
  };

  const handleEstadoCanje = async (id, estado) => {
    const res = await fetch(`${API}/api/admin/canjes/${id}/estado`, {
      method: 'PATCH', headers: getHeaders(),
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) { const d = await res.json(); alert(d.message); return; }
    setCanjes(prev => prev.map(c => c.id_canje === id ? { ...c, estado } : c));
  };

  const imgSrc = form.imagen_url
    ? (form.imagen_url.startsWith('/') ? `${API}${form.imagen_url}` : form.imagen_url)
    : null;

  return (
    <div className="seccion">
      <div className="admin-filters-row" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['premios', 'canjes'].map(t => (
            <button key={t} className={`filter-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'premios' ? 'Premios' : 'Canjes'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'premios' && (
        <>
          <div className="form-card">
            <p className="section-title">{editId ? 'Editar Premio' : 'Nuevo Premio'}</p>
            <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nombre</label>
                  <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Camiseta oficial" required />
                </div>
                <div className="form-group">
                  <label>Costo en puntos</label>
                  <input type="number" min="1" value={form.costo_puntos} onChange={e => setForm(p => ({ ...p, costo_puntos: e.target.value }))} placeholder="Ej: 500" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Descripción</label>
                  <textarea rows={2} value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Describe el premio..." required />
                </div>
                <div className="form-group">
                  <label>Stock <span style={{ opacity: 0.5 }}>(vacío = ilimitado)</span></label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="Ej: 10" />
                </div>
                <div className="form-group">
                  <label>Fecha inicio <span style={{ opacity: 0.5 }}>(opcional)</span></label>
                  <input type="date" value={form.fecha_inicio} onChange={e => setForm(p => ({ ...p, fecha_inicio: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Fecha fin <span style={{ opacity: 0.5 }}>(opcional)</span></label>
                  <input type="date" value={form.fecha_fin} onChange={e => setForm(p => ({ ...p, fecha_fin: e.target.value }))} />
                </div>

                {/* ── Imagen ── */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Imagen del premio <span style={{ opacity: 0.5 }}>(opcional)</span></label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        value={form.imagen_url}
                        onChange={e => setForm(p => ({ ...p, imagen_url: e.target.value }))}
                        placeholder="URL de imagen o sube un archivo"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                      <button type="button" className="act-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                        {uploading ? 'Subiendo...' : 'Subir imagen'}
                      </button>
                    </div>
                    {imgSrc && (
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={imgSrc}
                          alt="preview"
                          style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(220,38,38,0.3)' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, imagen_url: '' }))}
                          style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', border: 'none', borderRadius: '50%', width: 20, height: 20, color: '#fff', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="form-submit" disabled={saving}>{saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Crear Premio'}</button>
                {editId && <button type="button" className="act-btn" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </div>

          <div className="list-card">
            <p className="section-title">Premios registrados</p>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Costo</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Vence</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {premios.length === 0
                    ? <EmptyRow cols={9} msg="Sin premios registrados" />
                    : premios.map((p, i) => (
                      <tr key={p.id_premio}>
                        <td className="td-num">{i + 1}</td>
                        <td>
                          {p.imagen_url
                            ? <img src={p.imagen_url.startsWith('/') ? `${API}${p.imagen_url}` : p.imagen_url} alt={p.nombre} style={{ width: 48, height: 34, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(220,38,38,0.2)' }} onError={e => { e.target.style.display = 'none'; }} />
                            : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>—</span>
                          }
                        </td>
                        <td className="td-bold">{p.nombre}</td>
                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</td>
                        <td>{p.costo_puntos} pts</td>
                        <td>{p.stock === null ? '∞' : p.stock}</td>
                        <td>
                          <span style={{ color: p.activo ? '#22c55e' : '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>
                            {p.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>{p.fecha_fin ?? '—'}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="act-btn" onClick={() => handleEdit(p)}>Editar</button>
                            <button className={`act-btn ${p.activo ? 'reject' : 'approve'}`} onClick={() => handleToggleActivo(p)}>
                              {p.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button className="act-btn reject" onClick={() => handleDelete(p.id_premio)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'canjes' && (
        <div className="list-card">
          <p className="section-title">Canjes de jugadores</p>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Jugador</th><th>Premio</th><th>Puntos</th><th>Fecha</th><th>Estado</th><th></th>
                </tr>
              </thead>
              <tbody>
                {canjes.length === 0
                  ? <EmptyRow cols={7} msg="Sin canjes registrados" />
                  : canjes.map((c, i) => (
                    <tr key={c.id_canje}>
                      <td className="td-num">{i + 1}</td>
                      <td className="td-bold">{c.username}</td>
                      <td>{c.nombre_premio}</td>
                      <td>{c.puntos_usados} pts</td>
                      <td>{new Date(c.fecha_canje).toLocaleDateString('es-CO')}</td>
                      <td>
                        <span style={{ color: estadoColor[c.estado] ?? '#fff', fontWeight: 600, fontSize: '0.8rem' }}>{c.estado}</span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <select
                            value={c.estado}
                            onChange={e => handleEstadoCanje(c.id_canje, e.target.value)}
                            style={{ background: '#1a1a2e', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '2px 6px' }}
                          >
                            {ESTADOS_CANJE.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
