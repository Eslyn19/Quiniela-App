import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const persona = sequelize.define('persona', {
    id_persona: {
        type: DataTypes.INTEGER,
        field: 'ID_PERSONA',
        primaryKey: true,
        autoIncrement: true
    },
    primer_nombre: {
        type: DataTypes.STRING(20),
        field: 'PRIMER_NOMBRE',
        allowNull: false
    },
    segundo_nombre: {
        type: DataTypes.STRING(20),
        field: 'SEGUNDO_NOMBRE',
        allowNull: true
    },
    primer_apellido: {
        type: DataTypes.STRING(20),
        field: 'PRIMER_APELLIDO',
        allowNull: false
    },
    segundo_apellido: {
        type: DataTypes.STRING(20),
        field: 'SEGUNDO_APELLIDO',
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        field: 'FECHA_NACIMIENTO',
        allowNull: false
    }
}, {
    tableName: 'PERSONA',
    freezeTableName: true,
    timestamps: false
});

export default persona;