import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstadoApuesta = sequelize.define('EstadoApuesta', {
    id_estado_apuesta: { 
        type: DataTypes.INTEGER, 
        field: 'ID_ESTADO_APUESTA', 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(10),
        field: 'NOMBRE', 
        allowNull: false, 
        unique: true 
    },
}, { 
    tableName: 'ESTADO_APUESTA',
    freezeTableName: true, 
    timestamps: false 
});

export default EstadoApuesta;
