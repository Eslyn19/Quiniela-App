import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pais = sequelize.define('Pais', {
    id_pais: { 
        type: DataTypes.INTEGER,
        field: 'ID_PAIS', 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(50), 
        field: 'NOMBRE', 
        allowNull: false, 
        unique: true },
}, { 
    tableName: 'PAIS', 
    freezeTableName: true, 
    timestamps: false 
});

export default Pais;
