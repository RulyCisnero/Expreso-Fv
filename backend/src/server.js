

import 'dotenv/config';
import express from 'express';
import cors from "cors";
import pool from './database/connectionPostgreSQL.js';
import router  from './routes/apiRoutes.js';

//dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

//gestionar los middelware
server.use(express.json());
server.use(cors());

// Importar las rutas
server.use('/api', router);

//testeando conexion a la base de datos PostgreSQL
server.get("/", async (req,res)=>{
    const result = await pool.query("SELECT current_database()");
    res.send(`nombre de la base de datos: ${result.rows[0].current_database}`);
});

server.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT} base de datos postgres`);
});
