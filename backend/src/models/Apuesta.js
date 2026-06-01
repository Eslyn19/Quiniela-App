import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Apuesta = sequelize.define('Apuesta', {
    id_apuesta: { 
        type: DataTypes.INTEGER,     
        field: 'ID_APUESTA',         
        primaryKey: true, 
        autoIncrement: true 
    },
    id_estado_apuesta: { 
        type: DataTypes.INTEGER,     
        field: 'ID_ESTADO_APUESTA',  
        allowNull: false 
    },
    id_tipo_puntuacion: {
        type: DataTypes.INTEGER,
        field: 'ID_TIPO_PUNTUACION',
        allowNull: false
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        field: 'NOMBRE',             
        allowNull: false, 
        unique: true 
    },
    descripcion: { 
        type: DataTypes.STRING(500), 
        field: 'DESCRIPCION',        
        allowNull: false 
    },
    reglas: { 
        type: DataTypes.STRING(500), 
        field: 'REGLAS',             
        allowNull: false 
    },
    fecha_inicio: { 
        type: DataTypes.DATE,        
        field: 'FECHA_INICIO',       
        allowNull: false 
    },
    fecha_fin: { 
        type: DataTypes.DATE,        
        field: 'FECHA_FIN',          
        allowNull: false 
    },
}, { 
    tableName: 'APUESTA', 
    freezeTableName: true, 
    timestamps: false 
});

export default Apuesta;
