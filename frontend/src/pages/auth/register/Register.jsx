import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Particles from '../../../components/Particles';
import Toast from '../../../components/Toast';
import { validateRegisterForm } from '../../../utils/authValidations';
import { buildRegisterPayload, registerUser } from '../../../services/authService';
import './Register.css';
import homeImg from "../../../assets/home.png";

const formulario = { 
    primer_nombre: '', 
    segundo_nombre: '', 
    primer_apellido: '',
    segundo_apellido: '', 
    fecha_nacimiento: '', 
    correo_electronico: '', 
    username: '',
    password: '', 
    password_confirm: ''
};

export default function Register() {
    const [form, setForm] = useState(formulario);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateRegisterForm(form); // validar desde el backend
        
        if (validationError) { 
            setToast({ message: validationError, type: 'error' }); // ventana de errores
            return; 
        }

        setIsSubmitting(true);
        try {
            const payload = buildRegisterPayload(form);
            await registerUser(payload); // registrar desde service del backend
            setForm(formulario);
            setToast({ message: '¡Registro exitoso! Un administrador revisará tu solicitud.', type: 'success' });
        } catch (error) {
            setToast({ message: error.message || 'Ocurrió un error inesperado.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <a href="/" className="home-btn" aria-label="Ir al inicio">
                <img src={homeImg} alt="Inicio"/>
            </a>
            <Particles
                className="particles-bg"
                particleColors={['#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={1}
            />
            {/* div con estilo AOS*/}
            <div className="register-center" data-aos="flip-right">
                <div className="register-card">
                    <h1 className="register-title">Crear cuenta</h1>
                    {/* Formulario de registro */}
                    <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                        { /* Nombres de persona */ }
                        <div className="input-row">
                            <div className="input-group">
                                <label>Primer nombre</label>
                                <input type="text" name="primer_nombre" 
                                value={form.primer_nombre} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Segundo nombre</label>
                                <input type="text" name="segundo_nombre" 
                                value={form.segundo_nombre} onChange={handleChange} />
                            </div>
                        </div>
                        { /* Apellidos de persona */}
                        <div className="input-row">
                            <div className="input-group">
                                <label>Primer apellido</label>
                                <input type="text" name="primer_apellido" 
                                value={form.primer_apellido} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Segundo apellido</label>
                                <input type="text" name="segundo_apellido" 
                                value={form.segundo_apellido} onChange={handleChange}/>
                            </div>
                        </div>
                        { /* Fecha de nacimiento */ }
                        <div className="input-group">
                            <label>Fecha de nacimiento</label>
                            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} 
                            onChange={handleChange} required />
                        </div>
                        { /* Correo electrónico */ }
                        <div className="input-group">
                            <label>Correo electrónico</label>
                            <input type="email" name="correo_electronico" value={form.correo_electronico}
                            onChange={handleChange} required />
                        </div>
                        { /* Nombre de usuario */ }
                        <div className="input-group">
                            <label>Nombre de usuario</label>
                            <input type="text" name="username" value={form.username}
                            onChange={handleChange} required />
                        </div>
                        { /* Contraseña */ }
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input type="password" name="password" value={form.password} 
                            onChange={handleChange} required />
                        </div>
                        { /* Contraseña y confirmación */ }
                        <div className="input-group">
                            <label>Confirmar contraseña</label>
                            <input type="password" name="password_confirm" value={form.password_confirm} 
                            onChange={handleChange} required />
                        </div>

                        <button className="register-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear cuenta'}
                        </button>

                        <p className="login-prompt">
                            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}
