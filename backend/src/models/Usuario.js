import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        primaryKey: true,
        autoIncrement: true
    },
    id_persona: {
        type: DataTypes.INTEGER,
        field: 'ID_PERSONA',
        allowNull: false,
        unique: true
    },
    correo_electronico: {
        type: DataTypes.STRING(100),
        field: 'CORREO_ELECTRONICO',
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(50),
        field: 'USERNAME',
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING(255),
        field: 'PASS',
        allowNull: false
    }
}, {
    tableName: 'USUARIO',
    freezeTableName: true,
    timestamps: false
});

export default usuario;