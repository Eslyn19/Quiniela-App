import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TipoPuntuacion = sequelize.define('TipoPuntuacion', {
    id_tipo_puntuacion: { 
        type: DataTypes.INTEGER,     
        field: 'ID_TIPO_PUNTUACION',
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        field: 'NOMBRE',             
        allowNull: false, 
        unique: true 
    },
    puntos_base: {
        type: DataTypes.DECIMAL(5,2),
        field: 'PUNTOS_BASE',        
        defaultValue: 1.00
    },
    multiplicador: { 
        type: DataTypes.DECIMAL(5,2),
        field: 'MULTIPLICADOR',      
        defaultValue: 1.00 
    },
    penalizacion: { 
        type: DataTypes.DECIMAL(5,2),
        field: 'PENALIZACION',       
        defaultValue: 0.00 
    },
}, { 
    tableName: 'TIPO_PUNTUACION', 
    freezeTableName: true,
    timestamps: false 
});

export default TipoPuntuacion;
