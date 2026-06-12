import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Particles from '../../../components/Particles';
import Toast from '../../../components/Toast';
import { loginUser } from '../../../services/authService';
import { validateLogin } from '../../../utils/authValidations';
import hiddenImg from '../../../assets/hidden.png';
import sawImg from '../../../assets/saw.png';
import './Login.css';
import homeImg from "../../../assets/home.png";

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorValidacion = validateLogin(form);
        if (errorValidacion) { 
            setToast({ message: errorValidacion, type: 'error' }); 
            return; 
        }

        setLoading(true);
        try {
            const data = await loginUser(form);
            localStorage.setItem('token', data.token);
            window.location.href = data.rol === 'ADMIN' ? '/Admin' : '/Player';
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <a href="/" className="home-btn" aria-label="Ir al inicio">
                <img src={homeImg} alt="Inicio" />
            </a>
            <Particles className="particles-bg" />
            <div className="login-center" data-aos="flip-left">
                <div className="login-card">
                    <h1 className="login-title">Login</h1>
                    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                        {/* Usuario */}
                        <div className="input-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Contraseña */}
                        <div className="input-group">
                            <label>Contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                {/* Botón para mostrar/ocultar contraseña */}
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(p => !p)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <img src={showPassword ? sawImg : hiddenImg} alt="" />
                                </button>
                            </div>
                        </div>

                        <button className="login-btn" disabled={loading}>
                            {loading ? 'Cargando...' : 'Iniciar sesión'}
                        </button>
                        
                        <p className="signup-prompt">
                            ¿No tienes cuenta? <a href="/register">Regístrate</a>
                        </p>
                        <p className="signup-prompt">
                            ¿Olvidaste tu contraseña? <a href="/reset-password">Restablécela aquí</a>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}
