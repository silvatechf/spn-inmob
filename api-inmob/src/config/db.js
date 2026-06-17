const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
});

// Validación y configuración persistente
pool.on('connect', (client) => {
    client.query('SET search_path TO inmobiliaria, public')
        .catch(err => console.error("Error estableciendo search_path:", err));
});

module.exports = pool;