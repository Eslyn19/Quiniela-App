import app from "./app.js";

const port = Number(process.env.SERVER_PORT) || 3000

app.listen(port, (err) => 
    err ? console.log('Error starting server: ', err)
        : console.log(`Server is running on port ${port}`)
);