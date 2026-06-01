import { Sequelize } from 'sequelize';
import dotenv from "dotenv"

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_SERVER,
        port: parseInt(process.env.DB_PORT),
        dialect: 'mssql',
        logging: false,
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            }
        }
    }
);

export default sequelize