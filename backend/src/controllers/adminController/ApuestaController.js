import sequelize from '../../config/database.js';
import Apuesta from '../../models/Apuesta.js';
import EstadoApuesta from '../../models/EstadoApuesta.js';
import Evento from '../../models/Evento.js';
import EventoResultado from '../../models/EventoResultado.js';
// DB -> ID_ESTADO_APUESTA : 1 [CREADA], 2 [ABIERTA], 3 [CERRADA], 4 [CANCELADA]
const ESTADOS_GESTION = [1, 2];

export const obtenerApuestas = async (req, res) => {
    try {
        const [apuestas] = await sequelize.query(`EXEC ObtenerApuestas`);
        return res.json(apuestas);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener apuestas, ${error.message}` });
    }
};

export const crearApuesta = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            reglas,
            id_equipo_local,
            id_equipo_visitante,
            id_tipo_puntuacion,
            id_estado_apuesta,
            fecha_inicio,
            fecha_fin
        } = req.body;

        const errores = [];

        if (!nombre?.trim())
            errores.push('nombre requerido');

        if (!descripcion?.trim())
            errores.push('descripcion requerida');

        if (!reglas?.trim())
            errores.push('reglas requeridas');

        if (!id_equipo_local)
            errores.push('id_equipo_local requerido');

        if (!id_equipo_visitante)
            errores.push('id_equipo_visitante requerido');

        if (!id_tipo_puntuacion)
            errores.push('id_tipo_puntuacion requerido');

        if (!id_estado_apuesta)
            errores.push('id_estado_apuesta requerido');

        if (!fecha_inicio)
            errores.push('fecha_inicio requerida');

        if (!fecha_fin)
            errores.push('fecha_fin requerida');

        if (errores.length) {
            return res.status(400).json({
                message: 'Campos incompletos',
                errors: errores
            });
        }

        if (Number(id_equipo_local) === Number(id_equipo_visitante)) {
            return res.status(400).json({
                message: 'Los equipos deben ser distintos'
            });
        }

        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);

        if (fin <= inicio) {
            return res.status(400).json({
                message: 'fecha_fin debe ser posterior a fecha_inicio'
            });
        }

        const transaction = await sequelize.transaction();

        try {
            const nueva = await Apuesta.create(
                {
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim(),
                    reglas: reglas.trim(),
                    id_equipo_local: Number(id_equipo_local),
                    id_equipo_visitante: Number(id_equipo_visitante),
                    id_tipo_puntuacion: Number(id_tipo_puntuacion),
                    id_estado_apuesta: Number(id_estado_apuesta),
                    fecha_inicio: inicio,
                    fecha_fin: fin
                },
                { transaction }
            );

            await Evento.create(
                {
                    id_apuesta: nueva.id_apuesta,
                    nombre: nombre.trim(),
                    fecha: inicio
                },
                { transaction }
            );

            const [rows] = await sequelize.query(
                'EXEC ObtenerApuestaPorId @id_apuesta = :id',
                {
                    replacements: {
                        id: nueva.id_apuesta
                    },
                    transaction
                }
            );

            await transaction.commit();

            return res.status(201).json(rows[0] || nueva);

        } catch (txError) {
            await transaction.rollback();
            throw txError;
        }

    } catch (error) {
        return res.status(500).json({
            message: `Error al crear apuesta, ${error.message}`
        });
    }
};

export const actualizarEstadoApuesta = async (req, res) =>{
    const { id } = req.params;
    const { id_estado_apuesta } = req.body;

    if (!id_estado_apuesta) {
        return res.status(400).json({ message: 'id del estado apuesta es requerido' });
    }

    if (!ESTADOS_GESTION.includes(Number(id_estado_apuesta))) {
        return res.status(400).json({ 
            message: 'Solo se permite [creada] o [abierta] en esta sección' 
        });
    }

    try {
        const apuesta = await Apuesta.findByPk(id);
        if (!apuesta){
            return res.status(404).json({ message: 'Apuesta no encontrada'});
        }

        await apuesta.update({ id_estado_apuesta });
        return res.json({ message: 'Estado de la apuesta actualizado' });
    } catch (error) {
        return res.status(500).json({ 
            message: `Error al actualizar estado de apuesta, ${error.message}` 
        });
    }
};

export const eliminarApuesta = async (req, res) =>{
    const t = await sequelize.transaction();
    try {
        const apuesta = await Apuesta.findByPk(req.params.id, { transaction: t });

        if (!apuesta) {
            await t.rollback();
            return res.status(404).json({ message: 'Apuesta no existe' });
        }

        // Borrar en cascada: EVENTO_RESULTADO → EVENTO → APUESTA
        const eventos = await Evento.findAll({ 
            where: { id_apuesta: req.params.id }, transaction: t 
        });

        for (const ev of eventos) {
            await EventoResultado.destroy({ 
                where: { id_evento: ev.id_evento }, 
                transaction: t 
            });
        }

        // Borrar eventos asociados a la apuesta
        await Evento.destroy({ 
            where: { id_apuesta: req.params.id },
            transaction: t 
        });

        await apuesta.destroy({ transaction: t });
        await t.commit();
      
        return res.json({ message: 'Apuesta eliminada correctamente' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ 
            message: `Error al eliminar apuesta, ${error.message}` 
        });
    }
};