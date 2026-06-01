import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HistorialPuntos = sequelize.define('HistorialPuntos', {
    id_historial: {
        type: DataTypes.INTEGER,
        field: 'ID_HISTORIAL',
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        allowNull: false,
    },
    id_apuesta: {
        type: DataTypes.INTEGER,
        field: 'ID_APUESTA',
        allowNull: false,
    },
    id_pronostico: {
        type: DataTypes.INTEGER,
        field: 'ID_PRONOSTICO',
        allowNull: false,
    },
    puntos: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'PUNTOS',
        allowNull: false,
    },
    fecha_registro: {
        type: DataTypes.DATE,
        field: 'FECHA_REGISTRO',
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'HISTORIAL_PUNTOS',
    freezeTableName: true,
    timestamps: false,
});

export default HistorialPuntos;
