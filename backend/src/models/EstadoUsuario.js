import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const estadoUsuario = sequelize.define('EstadoUsuario', {
    id_estado_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_ESTADO_USUARIO',
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'JUGADOR'),
        field: 'ROL',
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'SUSPENDIDO'),
        field: 'ESTADO',
        allowNull: false
    }
}, {
    tableName: 'ESTADO_USUARIO',
    freezeTableName: true,
    timestamps: false
});

export default estadoUsuario;