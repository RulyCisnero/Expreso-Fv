import pg from "pg";
const { Pool } = pg;
// crear una instancia de pool de conexiones
// para manejar múltiples conexiones a la base de datos PostgreSQL
const pool = new pg.Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "ExpresoFv",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456",
});

pool.on("connect", () => {
    console.log("Conectado a la base de datos PostgreSQL");
});

export default pool;