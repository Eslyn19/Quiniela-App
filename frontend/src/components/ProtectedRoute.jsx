import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { API } from '../pages/views/admin/constants';

export default function ProtectedRoute({ children }) {
  const [estado, setEstado] = useState('verificando');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setEstado('denegado'); return; }

    fetch(`${API}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) setEstado('ok');
        else { localStorage.removeItem('token'); setEstado('denegado'); }
      })
      .catch(() => setEstado('denegado'));
  }, []);

  if (estado === 'verificando') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#a78bfa', fontFamily: 'sans-serif' }}>
      Verificando acceso...
    </div>
  );

  if (estado === 'denegado') 
    return <Navigate to="/login" replace />;

  return children;
}
