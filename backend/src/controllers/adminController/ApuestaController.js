import sequelize from '../../config/database.js';
import Apuesta from '../../models/Apuesta.js';
import EstadoApuesta from '../../models/EstadoApuesta.js';
import Evento from '../../models/Evento.js';
import EventoResultado from '../../models/EventoResultado.js';

// DB -> ID_ESTADO_APUESTA : 1 CREADA, 2 ABIERTA
const ESTADOS_GESTION = [1, 2];

// Llamar un PROC de la DB para obtener las apuestas
export const obtenerApuestas = async (req, res) => 
{
  try 
  {
    const [apuestas] = await sequelize.query(`EXEC ObtenerApuestas`);
    return res.json(apuestas);
  } catch (error) {
    return res.status(500).json({ 
      message: `Error al obtener apuestas, ${error.message}` 
    });
  }
};

// Crear apuesta nueva cuando se registre en ADMIN
export const crearApuesta = async (req, res) =>
{
  // Datos de apuesta en ADMIN -> SeccionApuesta (FRONTEND)
  const { nombre, descripcion, reglas, id_tipo_puntuacion,
    id_estado_apuesta, fecha_inicio, fecha_fin } = req.body;

  if (!nombre?.trim() ||
      !descripcion?.trim() ||
      !reglas?.trim() ||
      !id_tipo_puntuacion ||
      !id_estado_apuesta ||
      !fecha_inicio ||
      !fecha_fin) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const nueva = await Apuesta.create({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      reglas: reglas.trim(),
      id_tipo_puntuacion,
      id_estado_apuesta,
      fecha_inicio,
      fecha_fin,
    });
    
    // Crear el EVENNTO asociado a la apuesta automáticamente (relacion)
    await Evento.create({
      id_apuesta: nueva.id_apuesta,
      nombre: nombre.trim(),
      fecha: fecha_inicio,
    });

    const [rows] = await sequelize.query(`EXEC ObtenerApuestaPorId @id_apuesta = :id`,
    { 
      replacements: { id: nueva.id_apuesta } 
    });
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ 
      message: `Error al crear apuesta, ${error.message}`  
    });
  }
};

// Actualizar estado de apuesta en el apartado de 
// ADMIN -> SeccionApuesta (FRONTEND) (CREADA O ABIERTA)
// Creada no se participa solo esta ahi
// Abierta esta lista para comenzar a jugar
export const actualizarEstadoApuesta = async (req, res) =>
{
  const { id } = req.params;
  const { id_estado_apuesta } = req.body;

  if (!id_estado_apuesta) {
    return res.status(400).json({ 
      message: 'id del estado apuesta es requerido' 
    });
  }

  if (!ESTADOS_GESTION.includes(Number(id_estado_apuesta))) {
    return res.status(400).json({ 
      message: 'Solo se permite [creada] o [abierta] en esta sección' 
    });
  }

  try {
    const apuesta = await Apuesta.findByPk(id);
    if (!apuesta){
      return res.status(404).json({ 
        message: 'Apuesta no encontrada'
      });
    }

    await apuesta.update({ id_estado_apuesta });
    return res.json({ message: 'Estado de la apuesta actualizado' });
  } catch (error) {
    return res.status(500).json({ 
      message: `Error al actualizar estado de apuesta, ${error.message}` 
    });
  }
};

// Eliminar apuesta desde un ADMIN a la DB
export const eliminarApuesta = async (req, res) =>
{
  const t = await sequelize.transaction();
  try {
    const apuesta = await Apuesta.findByPk(req.params.id, { transaction: t });

    if (!apuesta) {
      await t.rollback();
      return res.status(404).json({ 
        message: 'Apuesta no encontrada | no existe' 
      });
    }

    // Borrar en cascada: EVENTO_RESULTADO → EVENTO → APUESTA
    const eventos = await Evento.findAll({ 
      where: { id_apuesta: req.params.id }, 
      transaction: t 
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