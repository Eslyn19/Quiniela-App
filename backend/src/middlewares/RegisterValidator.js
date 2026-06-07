const camposPresentes = (datos) => {
    const {
        primer_nombre,
        primer_apellido,
        fecha_nacimiento,
        correo_electronico,
        username,
        password
    } = datos;

    return primer_nombre && 
           primer_apellido && 
           fecha_nacimiento && 
           correo_electronico && 
           username && 
           password;
};

const emailValido = (email) => {
    return email.includes('@');
};

const esMayorDeEdad = (fechaNacimiento) => {
    const today = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = today.getFullYear() - fechaNac.getFullYear();
    const mesActual = today.getMonth();
    const mesNacimiento = fechaNac.getMonth();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && today.getDate() 
        < fechaNac.getDate())) {
        edad--;
    }
    return edad >= 18;
};

const fechaNacValida = (fechaNacimiento) => {
    const today = new Date();
    const fechaNac = new Date(fechaNacimiento);
    return fechaNac <= today;
};

export const validarRegistro = (req, res, next) => {
    const datos = req.body;

    if (!camposPresentes(datos)) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!esMayorDeEdad(datos.fecha_nacimiento)) {
        return res.status(400).json({
            message: "El usuario debe ser mayor de edad para registrarse."
        });
    }

    if (!fechaNacValida(datos.fecha_nacimiento)) {
        return res.status(400).json({ message: "Fecha seleccionada invalida." });
    }

    if (!emailValido(datos.correo_electronico)) {
        return res.status(400).json({
            message: "Formato de correo electrónico no válido."
        });
    }

    next();
};
