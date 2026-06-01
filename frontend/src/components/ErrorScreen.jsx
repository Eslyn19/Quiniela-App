import '../css/componentsCSS/ErrorScreen.css';

export default function ErrorScreen({ error, message = 'Algo salió mal' }) {
    return (
        <div className="error-screen">
            <p className="error-screen-title">{message}</p>
            {error && <p className="error-screen-detail">{error}</p>}
        </div>
    );
}
