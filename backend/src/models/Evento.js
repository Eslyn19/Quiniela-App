import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Evento = sequelize.define('Evento', {
    id_evento: { 
        type: DataTypes.INTEGER,     
        field: 'ID_EVENTO',  
        primaryKey: true, 
        autoIncrement: true 
    },
    id_apuesta: { 
        type: DataTypes.INTEGER,     
        field: 'ID_APUESTA', 
        allowNull: false 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        field: 'NOMBRE',     
        allowNull: false 
    },
    fecha: { 
        type: DataTypes.DATE,        
        field: 'FECHA',      
        allowNull: false 
    },
}, { 
    tableName: 'EVENTO', 
    freezeTableName: true, 
    timestamps: false 
});

export default Evento;
