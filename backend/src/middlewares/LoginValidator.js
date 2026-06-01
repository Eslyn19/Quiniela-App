const camposPresentes = ({ username, password }) => {
    return username && password;
};

const usernameValido = (username) => {
    return typeof username === "string" && username.trim().length >= 3;
};

const passwordValido = (password) => {
    return typeof password === "string" && password.length >= 6;
};

export const validarLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!camposPresentes(req.body)) {
        return res.status(400).json({
            message: "Completa todos los campos"
        });
    }

    req.body.username = username.trim().toLowerCase();

    if (!usernameValido(username)) {
        return res.status(400).json({
            message: "Creedenciales inválidas"
        });
    }

    if (!passwordValido(password)) {
        return res.status(400).json({
            message: "Creedenciales inválidas"
        });
    }

    next();
};
