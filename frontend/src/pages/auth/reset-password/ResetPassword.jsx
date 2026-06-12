import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Particles from '../../../components/Particles';
import Toast from '../../../components/Toast';
import { resetPassword } from '../../../services/authService';
import { validateResetPassword } from '../../../utils/authValidations';
import hiddenImg from '../../../assets/hidden.png';
import sawImg from '../../../assets/saw.png';
import './ResetPassword.css';
import homeImg from "../../../assets/home.png";

export default function ResetPassword() {
    const [form, setForm] = useState({
        username: '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [show, setShow] = useState({ current: false, password: false, confirm: false });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggle = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorValidacion = validateResetPassword(form);
        
        if (errorValidacion) { 
            setToast({ message: errorValidacion, type: 'error' });
            return; 
        }

        setLoading(true);
        try {
            await resetPassword(form);
            window.location.href = '/';
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
                    <h1 className="login-title">Restablecer contraseña</h1>
                    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                        { /* Usuario y contrasena actual */}
                        <div className="input-row">
                            <div className="input-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label>Contraseña actual</label>
                                <div className="password-wrapper">
                                    <input
                                        type={show.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className="password-toggle" onClick={() => toggle('current')} aria-label={show.current ? 'Ocultar' : 'Mostrar'}>
                                        <img src={show.current ? sawImg : hiddenImg} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        { /* Nueva contraseña */ }
                        <div className="input-group">
                            <label>Nueva contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={show.password ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <button type="button" className="password-toggle" onClick={() => toggle('password')} aria-label={show.password ? 'Ocultar' : 'Mostrar'}>
                                    <img src={show.password ? sawImg : hiddenImg} alt="" />
                                </button>
                            </div>
                        </div>
                        {/* Confirmar contrasena */}
                        <div className="input-group">
                            <label>Confirmar contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={show.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button type="button" className="password-toggle" onClick={() => toggle('confirm')} aria-label={show.confirm ? 'Ocultar' : 'Mostrar'}>
                                    <img src={show.confirm ? sawImg : hiddenImg} alt="" />
                                </button>
                            </div>
                        </div>

                        <button className="login-btn" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Restablecer contraseña'}
                        </button>

                        <p className="signup-prompt">
                            ¿Recordaste tu contraseña? <a href="/login">Iniciar sesión</a>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}
