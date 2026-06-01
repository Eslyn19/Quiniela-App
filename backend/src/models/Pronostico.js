import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pronostico = sequelize.define('Pronostico', {
    id_pronostico: {
        type: DataTypes.INTEGER,
        field: 'ID_PRONOSTICO',
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        allowNull: false,
    },
    id_evento: {
        type: DataTypes.INTEGER,
        field: 'ID_EVENTO',
        allowNull: false,
    },
    pts_local: {
        type: DataTypes.INTEGER,
        field: 'PTS_LOCAL',
        allowNull: false,
        defaultValue: 0,
    },
    pts_visitante: {
        type: DataTypes.INTEGER,
        field: 'PTS_VISITANTE',
        allowNull: false,
        defaultValue: 0,
    },
    fecha_registro: {
        type: DataTypes.DATE,
        field: 'FECHA_REGISTRO',
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'PRONOSTICO',
    freezeTableName: true,
    timestamps: false,
});

export default Pronostico;
