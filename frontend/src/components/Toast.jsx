import { useEffect } from 'react';
import '../css/componentsCSS/Toast.css';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`toast toast--${type}`}>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
    );
}
