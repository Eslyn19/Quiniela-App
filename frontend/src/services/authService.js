const API = 'http://localhost:3000';

export const loginUser = async ({ username, password }) => {
    const res = await fetch(`${API}/api/registro/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
    return data;
};

export const buildRegisterPayload = (form) => ({
    primer_nombre: form.primer_nombre.trim(),
    segundo_nombre: form.segundo_nombre.trim() || null,
    primer_apellido: form.primer_apellido.trim(),
    segundo_apellido: form.segundo_apellido.trim() || null,
    fecha_nacimiento: form.fecha_nacimiento,
    correo_electronico: form.correo_electronico.trim().toLowerCase(),
    username: form.username.trim(),
    password: form.password,
});

export const registerUser = async (payload) => {
    const res = await fetch(`${API}/api/registro/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) 
        throw new Error(data.message || 'Error al registrar usuario');
    return data;
};

export const resetPassword = async (form) => {
    const res = await fetch(`${API}/api/registro/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: form.username.trim(),
            currentPassword: form.currentPassword,
            password: form.password,
            confirmPassword: form.confirmPassword,
        }),
    });
    const data = await res.json();
    if (!res.ok) 
        throw new Error(data.message || 'Error al restablecer la contraseña');
    return data;
};
