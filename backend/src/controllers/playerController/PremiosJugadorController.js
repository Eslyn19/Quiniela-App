import sequelize from '../../config/database.js';
import Premio from '../../models/Premio.js';
import Canje from '../../models/Canje.js';

export const obtenerPremiosDisponibles = async (req, res) => {
    try {
        const premios = await Premio.findAll({
            where: { activo: true },
            order: [['costo_puntos', 'ASC']],
        });
        return res.json(premios);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener premios" });
    }
};

export const obtenerPuntosDisponibles = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    try {
        const [row] = await sequelize.query(`EXEC ObtenerPuntosUsuario :id_usuario`,
        { 
                replacements: { id_usuario }, 
                type: sequelize.QueryTypes.SELECT 
            }
        );
        return res.json({ total: Number(row.total), 
                          gastado: Number(row.gastado), 
                          disponible: Number(row.disponible) });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener puntos"});
    }
};

export const canjearPremio = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const { id } = req.params;

    const t = await sequelize.transaction();
    try {
        const premio = await Premio.findByPk(id, { transaction: t, lock: true });
        
        if (!premio || !premio.activo) {
            await t.rollback();
            return res.status(404).json({ message: 'Premio no disponible' });
        }
        
        if (premio.stock !== null && premio.stock <= 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Premio sin stock disponible' });
        }

        const hoy = new Date();
        if (premio.fecha_inicio && new Date(premio.fecha_inicio) > hoy) {
            await t.rollback();
            return res.status(400).json({ message: 'El premio no disponible' });
        }
        if (premio.fecha_fin && new Date(premio.fecha_fin) < hoy) {
            await t.rollback();
            return res.status(400).json({ message: 'El premio ha expirado' });
        }

        const [row] = await sequelize.query(`EXEC ObtenerPuntosUsuario :id_usuario`,
            { 
                replacements: { id_usuario }, 
                type: sequelize.QueryTypes.SELECT, 
                transaction: t 
            }
        );
        const disponible = Number(row.disponible);

        if (disponible < premio.costo_puntos) {
            await t.rollback();
            return res.status(400).json({ message: "Puntos insuficientes" });
        }

        const canje = await Canje.create({
            id_usuario,
            id_premio: id,
            puntos_usados: premio.costo_puntos,
            estado: 'PENDIENTE',
        }, { transaction: t });

        if (premio.stock !== null) {
            await premio.update({ stock: premio.stock - 1 }, { transaction: t });
        }

        await t.commit();
        return res.status(201).json({ message: 'Canje realizado exitosamente', canje});
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: "Error al canjear premio" });
    }
};

export const obtenerMisCanjes = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    try {
        const canjes = await sequelize.query(`EXEC ObtenerMisCanjes :id_usuario`,
            { 
                replacements: { id_usuario }, 
                type: sequelize.QueryTypes.SELECT 
            }
        );
        return res.json(canjes);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener canjes"});
    }
};
