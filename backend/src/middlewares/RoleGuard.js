import EstadoUsuario from "../models/EstadoUsuario.js";

const requireRole = (rol, requiereAprobado = false) => async (req, res, next) => {
    try {
        const estado = await EstadoUsuario.findOne({ where: { id_usuario: req.user.id_usuario } });

        if (!estado || estado.rol !== rol || (requiereAprobado && estado.estado !== "APROBADO")) {
            return res.status(403).json({ message: `Acceso denegado`});
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Error de sistema" });
    }
};

export const isAdmin = requireRole("ADMIN");
export const isPlayer = requireRole("JUGADOR", true);
