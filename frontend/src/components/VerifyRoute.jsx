import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

// Ruta protegida genérica. Verifica el token contra el endpoint indicado
// antes de renderizar children; redirige a /login si falla.
export default function VerifyRoute({ children, endpoint }) {
    const [estado, setEstado] = useState('verificando');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setEstado('denegado'); return; }

        fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.ok) setEstado('ok');
                else { localStorage.removeItem('token'); setEstado('denegado'); }
            })
            .catch(() => setEstado('denegado'));
    }, [endpoint]);

    if (estado === 'verificando') return <LoadingScreen />;

    if (estado === 'denegado') return <Navigate to="/login" replace />;

    return children;
}
