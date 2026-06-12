// models/Apuesta.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Apuesta = sequelize.define(
  'Apuesta',
  {
    id_apuesta: {
      type: DataTypes.INTEGER,
      field: 'ID_APUESTA',
      primaryKey: true,
      autoIncrement: true,
    },
    id_equipo_local: {
    type: DataTypes.INTEGER,
    field: 'ID_EQUIPO_LOCAL',
    allowNull: false,
    },
    id_equipo_visitante: {
        type: DataTypes.INTEGER,
        field: 'ID_EQUIPO_VISITANTE',
        allowNull: false,
    },
    id_estado_apuesta: {
      type: DataTypes.INTEGER,
      field: 'ID_ESTADO_APUESTA',
      allowNull: false,
      references: {
        model: 'ESTADO_APUESTA',
        key: 'ID_ESTADO_APUESTA',
      },
    },
    id_tipo_puntuacion: {
      type: DataTypes.INTEGER,
      field: 'ID_TIPO_PUNTUACION',
      allowNull: false,
      references: {
        model: 'TIPO_PUNTUACION',
        key: 'ID_TIPO_PUNTUACION',
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      field: 'NOMBRE',
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100],
      },
    },
    descripcion: {
      type: DataTypes.STRING(500),
      field: 'DESCRIPCION',
      allowNull: false,
      validate: {
        len: [1, 500],
      },
    },
    reglas: {
      type: DataTypes.STRING(500),
      field: 'REGLAS',
      allowNull: false,
      validate: {
        len: [1, 500],
      },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      field: 'FECHA_INICIO',
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      field: 'FECHA_FIN',
      allowNull: false,
    },
  },
  {
    tableName: 'APUESTA',
    freezeTableName: true,
    timestamps: false,
    validate: {
      fechaValida() {
        if (new Date(this.fecha_fin) <= new Date(this.fecha_inicio)) {
          throw new Error('fecha_fin debe ser posterior a fecha_inicio');
        }
      },
    },
  }
);

export default Apuesta;