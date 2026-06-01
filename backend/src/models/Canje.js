import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Canje = sequelize.define('Canje', {
    id_canje: {
        type: DataTypes.INTEGER,
        field: 'ID_CANJE',
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        field: 'ID_USUARIO',
        allowNull: false,
    },
    id_premio: {
        type: DataTypes.INTEGER,
        field: 'ID_PREMIO',
        allowNull: false,
    },
    puntos_usados: {
        type: DataTypes.INTEGER,
        field: 'PUNTOS_USADOS',
        allowNull: false,
    },
    fecha_canje: {
        type: DataTypes.DATE,
        field: 'FECHA_CANJE',
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.STRING(20),
        field: 'ESTADO',
        allowNull: false,
        defaultValue: 'PENDIENTE',
    },
}, {
    tableName: 'CANJE',
    freezeTableName: true,
    timestamps: false,
});

export default Canje;
