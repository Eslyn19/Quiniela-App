import sequelize from '../../config/database.js';
import Premio from '../../models/Premio.js';
import Canje from '../../models/Canje.js';

export const obtenerPremios = async (req, res) => {
    try {
        const premios = await Premio.findAll({ order: [['id_premio', 'ASC']] });
        return res.json(premios);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener premios, ${error.message}` });
    }
};

export const crearPremio = async (req, res) => {
    const { nombre, 
            descripcion, 
            costo_puntos, 
            stock, 
            fecha_inicio, 
            fecha_fin, 
            imagen_url } = req.body;

    if (!nombre?.trim() || !descripcion?.trim() || !costo_puntos) {
        return res.status(400).json({ message: 'Campos son requeridos' });
    }
    
    if (Number(costo_puntos) <= 0) {
        return res.status(400).json({ message: 'El costo debe ser positivo' });
    }

    try {
        const premio = await Premio.create({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            costo_puntos: Number(costo_puntos),
            stock: stock !== undefined && stock !== '' ? Number(stock) : null,
            activo: true,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            imagen_url: imagen_url || null,
        });
        return res.status(201).json(premio);
    } catch (error) {
        return res.status(500).json({ message: `Error al crear premio, ${error.message}` });
    }
};

export const actualizarPremio = async (req, res) => {
    try {
        const premio = await Premio.findByPk(req.params.id);
        if (!premio) {
            return res.status(404).json({ message: 'Premio no existe' });
        }

        const { nombre, 
                descripcion, 
                costo_puntos, 
                stock, 
                activo, 
                fecha_inicio, 
                fecha_fin, 
                imagen_url } = req.body;
        // Si se digita el nombre se cambia, si es vacio se mantiene.
        await premio.update({
            nombre: nombre?.trim() ?? premio.nombre,
            descripcion: descripcion?.trim() ?? premio.descripcion,
            costo_puntos: costo_puntos ?? premio.costo_puntos,
            stock: stock ?? premio.stock,
            activo: activo ?? premio.activo,
            fecha_inicio: fecha_inicio ?? premio.fecha_inicio,
            fecha_fin: fecha_fin ?? premio.fecha_fin,
            imagen_url: imagen_url ?? premio.imagen_url,
        });
        return res.json(premio);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al actualizar premio, ${error.message}` 
        });
    }
};

export const eliminarPremio = async (req, res) => {
    try {
        const premio = await Premio.findByPk(req.params.id);
        if (!premio){ 
            return res.status(404).json({ message: 'Premio no encontrado' });
        }
        await premio.destroy();
        return res.json({ message: 'Premio eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al eliminar premio, ${error.message}` 
        });
    }
};

export const obtenerCanjes = async (req, res) => {
    try {
        const [canjes] = await sequelize.query(`EXEC ObtenerCanjes`);
        return res.json(canjes);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al obtener canjes, ${error.message}` 
        });
    }
};

export const actualizarEstadoCanje = async (req, res) => {
    const { estado } = req.body;
    
    if (!['PENDIENTE', 'ENTREGADO', 'RECHAZADO'].includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido' });
    }

    try {
        const canje = await Canje.findByPk(req.params.id);
        if (!canje) {
            return res.status(404).json({ message: 'Canje no encontrado' });
        }

        await canje.update({ estado });
        return res.json(canje);
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al actualizar canje, ${error.message}` 
        });
    }
};
