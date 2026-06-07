import app from "./app.js";
import sequelize from "./src/config/database.js";

const port = Number(process.env.SERVER_PORT) || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("\nConnection to database has been established successfully.");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

startServer();