import bcrypt from 'bcryptjs';

// Función para encriptar la contraseña
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Función para comparar la contraseña ingresada con el hash almacenado
export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
