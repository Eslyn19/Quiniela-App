import { useCallback } from 'react';

// Devuelve una función estable que construye los headers de autenticación
// para las llamadas a los endpoints de player.
export const usePlayerHeaders = () => {
    return useCallback(() => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }), []);
};
