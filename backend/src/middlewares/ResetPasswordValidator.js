export const validarResetPassword = (req, res, next) => {
    const {
        username,
        currentPassword,
        password,
        confirmPassword
    } = req.body;

    if (!username || !currentPassword || !password || !confirmPassword) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    req.body.username = username.trim().toLowerCase();

    if (typeof username !== "string" || username.trim().length < 3) {
        return res.status(400).json({ message: "Usuario inválido" });
    }

    if (typeof currentPassword !== "string" || currentPassword.length < 6) {
        return res.status(400).json({ message: "Contraseña actual inválida" });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ 
            message: "La nueva contraseña debe tener al menos 6 caracteres" 
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    if (currentPassword === password) {
        return res.status(400).json({ 
            message: "La nueva contraseña debe ser diferente a la actual" 
        });
    }

    next();
};
