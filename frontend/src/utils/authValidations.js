export const validateLogin = ({ username, password }) => {
    if (!username || !password) return 'Todos los campos son obligatorios';
    return null;
};

const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const validateLetterField = (value, fieldName) => {
    if (!onlyLettersRegex.test(value.trim())) 
        return `${fieldName} solo permite letras.`;
    return '';
};

export const validateRegisterForm = (form) => {
    const requiredFields = {
        primer_nombre: 'Primer nombre',
        primer_apellido: 'Primer apellido',
        fecha_nacimiento: 'Fecha de nacimiento',
        correo_electronico: 'Correo electrónico',
        username: 'Nombre de usuario',
        password: 'Contraseña',
        password_confirm: 'Confirmar contraseña',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
        const value = form[field];
        if (!value || !String(value).trim())
            return `${label} es obligatorio.`;
    }

    for (const { value, label } of [
        { value: form.primer_nombre, label: 'Primer nombre' },
        { value: form.primer_apellido, label: 'Primer apellido' },
    ]) {
        const error = validateLetterField(value, label);
        if (error) return error;
    }

    for (const { value, label } of [
        { value: form.segundo_nombre, label: 'Segundo nombre' },
        { value: form.segundo_apellido, label: 'Segundo apellido' },
    ]) {
        if (value && value.trim()) {
            const error = validateLetterField(value, label);
            if (error) return error;
        }
    }

    if (form.username.trim().length < 3) 
        return 'El nombre de usuario debe tener al menos 3 caracteres.';
    if (/\s/.test(form.username)) 
        return 'El nombre de usuario no puede contener espacios.';

    if (form.password.length < 8) 
        return 'La contraseña debe tener al menos 8 caracteres.';
    if (form.password !== form.password_confirm) 
        return 'Las contraseñas no coinciden.';
    
    return '';
};

export const validateResetPassword = ({ username, currentPassword, password, confirmPassword }) => {
    if (!username || !currentPassword || !password || !confirmPassword)
        return 'Todos los campos son obligatorios';
    if (password.length < 6)
        return 'La nueva contraseña debe tener al menos 6 caracteres';
    if (password !== confirmPassword)
        return 'Las contraseñas no coinciden';
    if (currentPassword === password)
        return 'La nueva contraseña debe ser diferente a la actual';
    return null;
};
