import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoResultado = sequelize.define('EventoResultado', {
    id_evento_resultado: { 
        type: DataTypes.INTEGER,     
        field: 'ID_EVENTO_RESULTADO', 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_evento: { 
        type: DataTypes.INTEGER,     
        field: 'ID_EVENTO',           
        allowNull: false, 
        unique: true 
    },
    resultado: { 
        type: DataTypes.STRING(100), 
        field: 'RESULTADO',           
        allowNull: false 
    },
    pts_equipo_a: { 
        type: DataTypes.INTEGER,     
        field: 'PTS_EQUIPO_A',        
        allowNull: true 
    },
    pts_equipo_b: { 
        type: DataTypes.INTEGER,    
        field: 'PTS_EQUIPO_B',        
        allowNull: true 
    },
    fecha_registro: { 
        type: DataTypes.DATE,        
        field: 'FECHA_REGISTRO',      
        allowNull: true 
    },
}, { 
    tableName: 'EVENTO_RESULTADO', 
    freezeTableName: true, 
    timestamps: false 
});

export default EventoResultado;
