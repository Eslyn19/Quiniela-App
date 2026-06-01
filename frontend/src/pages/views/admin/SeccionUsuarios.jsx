import { useState } from 'react';
import { StatCard, EmptyRow } from './shared';
import { API, ESTADO_COLOR } from './constants';
import { useAdmin } from '../../../contexts/AdminContext';
import lupa from '../../../assets/lupa.png';

const FILTROS  = ['TODOS', 'APROBADO', 'PENDIENTE', 'SUSPENDIDO', 'RECHAZADO'];
const ESTADOS  = ['APROBADO', 'PENDIENTE', 'RECHAZADO', 'SUSPENDIDO'];

export default function SeccionUsuarios() {
  const { usuarios, setUsuarios, filtroU: filtro, setFiltroU: setFiltro, getHeaders } = useAdmin();
  const [busqueda, setBusqueda] = useState('');

  const cambiarEstado = async (id, estado) => {
    const res = await fetch(`${API}/api/admin/usuarios/${id}/estado`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ estado }),
    });
    if (res.ok) {
      setUsuarios(prev => prev.map(u => u.id_usuario === id ? { ...u, estado } : u));
    }
  };

  const porEstado  = filtro === 'TODOS' ? usuarios : usuarios.filter(u => u.estado === filtro);
  const filtrados  = busqueda.trim()
    ? porEstado.filter(u => u.correo_electronico?.toLowerCase().includes(busqueda.toLowerCase()))
    : porEstado;
  const stats = {
    total:       usuarios.length,
    aprobados:   usuarios.filter(u => u.estado === 'APROBADO').length,
    pendientes:  usuarios.filter(u => u.estado === 'PENDIENTE').length,
    suspendidos: usuarios.filter(u => u.estado === 'SUSPENDIDO').length,
  };

  return (
    <div className="seccion">
      <div className="admin-stats">
        <StatCard label="Total"       value={stats.total}       color="#a78bfa" />
        <StatCard label="Aprobados"   value={stats.aprobados}   color="#6bff95" />
        <StatCard label="Pendientes"  value={stats.pendientes}  color="#ffd166" />
        <StatCard label="Suspendidos" value={stats.suspendidos} color="#ff9f43" />
      </div>

      <div className="section-block">
        <h2 className="section-title">Gestión de Usuarios</h2>

        <div className="admin-filters-row">
          <div className="admin-filters">
            {FILTROS.map(f => (
              <button
                key={f}
                className={`filter-btn ${filtro === f ? 'active' : ''}`}
                onClick={() => setFiltro(f)}
              >
                {f === 'TODOS' ? 'Todos' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form className="user-search-box" onSubmit={e => e.preventDefault()}>
            <img src={lupa} alt="buscar" />
            <input
              type="text"
              placeholder="Buscar por correo..."
              value={busqueda}
              autoComplete="off"
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') setBusqueda(''); }}
            />
            {busqueda && (
              <button type="button" className="user-search-clear" onClick={() => setBusqueda('')}>✕</button>
            )}
          </form>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Usuario</th><th>Nombre</th>
                <th>Correo</th><th>Rol</th><th>Estado</th><th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, i) => (
                <tr key={u.id_usuario}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-bold">{u.username}</td>
                  <td>{u.nombre}</td>
                  <td className="td-muted">{u.correo_electronico}</td>
                  <td><span className={`rol-badge ${u.rol?.toLowerCase()}`}>{u.rol}</span></td>
                  <td><span className="estado-badge" style={{ color: ESTADO_COLOR[u.estado] }}>{u.estado}</span></td>
                  <td>
                    <select
                      className="estado-select"
                      value={u.estado}
                      disabled={u.rol?.toUpperCase() === 'ADMIN'}
                      onChange={e => cambiarEstado(u.id_usuario, e.target.value)}
                    >
                      {ESTADOS.map(s => (
                        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <EmptyRow cols={7} msg="No hay usuarios con este filtro" />}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
