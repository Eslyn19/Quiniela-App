import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UsuarioApuesta = sequelize.define('UsuarioApuesta', {
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        primaryKey: true,
    },
    id_apuesta: {
        type: DataTypes.INTEGER,
        field: 'ID_APUESTA',
        primaryKey: true,
    },
    puntos: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'PUNTOS',
        defaultValue: 0,
    },
}, {
    tableName: 'USUARIO_APUESTA',
    freezeTableName: true,
    timestamps: false,
});

export default UsuarioApuesta;
