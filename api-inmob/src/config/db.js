const { Pool } = require('pg');
const path = require('path');

// Esto fuerza a buscar el .env en la raíz (una carpeta arriba de donde está este archivo)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, // Ahora coincidirá con el .env corregido
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
});

// ... resto de tu código igual ...

// Un pequeño log de control para verificar si el Pool ya tiene las credenciales cargadas en memoria
console.log(`📡 Pool de PostgreSQL configurado para el host: ${process.env.DB_HOST || 'FALTA HOST'} en la BD: ${process.env.DB_NAME || 'FALTA BD'}`);

pool.on('connect', () => {
    console.log('✔ Conexión establecida con la base de datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el Pool de PostgreSQL:', err.message);
});

module.exports = pool;