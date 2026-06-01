import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API } from '../pages/views/admin/constants';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seccion, setSeccion] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [filtroU, setFiltroU] = useState('TODOS');
  const [equipos, setEquipos] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const [apuestasVer, setApuestasVer] = useState(0);
  const [punts, setPunts] = useState([]);
  const [catalogos, setCatalogos]  = useState({ estados: [] });
  const [premios, setPremios] = useState([]);
  const [canjes, setCanjes] = useState([]);

  const [formA, setFormA] = useState({
    nombre: '', descripcion: '', reglas: '',
    id_tipo_puntuacion: '', id_estado_apuesta: '',
    fecha_inicio: '', fecha_fin: '',
  });

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }), []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API}/api/admin/verify`, { headers: getHeaders() });
        if (!res.ok) { window.location.href = '/login'; return; }
        setAdmin(await res.json());

        const [rU, rE, rA, rP, rC, rPrem, rCanj] = await Promise.all([
          fetch(`${API}/api/admin/usuarios`,     { headers: getHeaders() }),
          fetch(`${API}/api/admin/equipos`,      { headers: getHeaders() }),
          fetch(`${API}/api/admin/apuestas`,     { headers: getHeaders() }),
          fetch(`${API}/api/admin/puntuaciones`, { headers: getHeaders() }),
          fetch(`${API}/api/admin/catalogos`,    { headers: getHeaders() }),
          fetch(`${API}/api/admin/premios`,      { headers: getHeaders() }),
          fetch(`${API}/api/admin/canjes`,       { headers: getHeaders() }),
        ]);

        const [uData, eData, aData, pData, premData, canjData] = await Promise.all([
          rU.json(), rE.json(), rA.json(), rP.json(), rPrem.json(), rCanj.json(),
        ]);

        setUsuarios(Array.isArray(uData)    ? uData    : []);
        setEquipos(Array.isArray(eData)     ? eData    : []);
        setApuestas(Array.isArray(aData)    ? aData    : []);
        setPunts(Array.isArray(pData)       ? pData    : []);
        setPremios(Array.isArray(premData)  ? premData : []);
        setCanjes(Array.isArray(canjData)   ? canjData : []);
        setCatalogos(await rC.json());
      } catch {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [getHeaders]);

  const value = useMemo(() => ({
    admin, loading,
    seccion, setSeccion,
    logout,
    getHeaders,
    usuarios, setUsuarios,
    filtroU, setFiltroU,
    equipos, setEquipos,
    apuestas, setApuestas,
    apuestasVer, setApuestasVer,
    punts, setPunts,
    catalogos, setCatalogos,
    premios, setPremios,
    canjes, setCanjes,
    formA, setFormA,
  }), [
    admin, loading,
    seccion,
    logout, getHeaders,
    usuarios, filtroU,
    equipos,
    apuestas, apuestasVer,
    punts,
    catalogos,
    premios, canjes,
    formA,
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin debe usarse dentro de <AdminProvider>');
  return ctx;
}
