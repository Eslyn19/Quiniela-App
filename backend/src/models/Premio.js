import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Premio = sequelize.define('Premio', {
    id_premio: {
        type: DataTypes.INTEGER,
        field: 'ID_PREMIO',
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        field: 'NOMBRE',
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(500),
        field: 'DESCRIPCION',
        allowNull: false,
    },
    costo_puntos: {
        type: DataTypes.INTEGER,
        field: 'COSTO_PUNTOS',
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        field: 'STOCK',
        allowNull: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        field: 'ACTIVO',
        allowNull: false,
        defaultValue: true,
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        field: 'FECHA_INICIO',
        allowNull: true,
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        field: 'FECHA_FIN',
        allowNull: true,
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        field: 'IMAGEN_URL',
        allowNull: true,
    },
}, {
    tableName: 'PREMIO',
    freezeTableName: true,
    timestamps: false,
});

export default Premio;
