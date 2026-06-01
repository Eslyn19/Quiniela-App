import { useState, useEffect } from 'react';
import { API } from './constants';

export default function SeccionEquipos({ getHeaders }) {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`${API}/api/player/equipos`, { headers: getHeaders() });
        const data = await res.json();
        setEquipos(Array.isArray(data) ? data : []);
      } catch {
        /* silencioso: la tabla quedará vacía */
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [getHeaders]);

  return (
    <div className="player-seccion">
      <div>
        <h1 className="player-section-title">Ver equipos</h1>
        <p className="player-section-sub">Consulta los equipos registrados en la plataforma.</p>
      </div>

      <div className="eq-table-wrap">
        {loading ? (
          <div className="eq-loading">
            <span className="player-loading-dot" /> Cargando equipos...
          </div>
        ) : equipos.length === 0 ? (
          <div className="eq-empty">No hay equipos registrados.</div>
        ) : (
          <table className="eq-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((e, i) => (
                <tr key={e.id_equipo}>
                  <td className="eq-td-num">{i + 1}</td>
                  <td className="eq-td-bold">{e.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
