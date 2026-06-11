const pool = require('../config/db');

// [GET] Catálogo con filtros y paginación
const getPropiedades = async (req, res) => {
    try {
        let { page = 1, limit = 9, search, operacion, precio_max } = req.query;
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, parseInt(limit));
        const offset = (page - 1) * limit;

        let whereClauses = 'WHERE deleted_at IS NULL';
        const queryParams = [];
        let placeholderCounter = 1;

        if (search && search.trim() !== '') {
            whereClauses += ` AND (titulo ILIKE $${placeholderCounter} OR direccion_publica ILIKE $${placeholderCounter})`;
            queryParams.push(`%${search.trim()}%`);
            placeholderCounter++;
        }

        if (operacion && operacion !== 'Todos los regímenes') {
            whereClauses += ` AND operacion = $${placeholderCounter}`;
            queryParams.push(operacion.toLowerCase());
            placeholderCounter++;
        }

        if (precio_max && precio_max !== 'Cualquier rango') {
            const val = parseFloat(precio_max.replace(/[^\d]/g, ''));
            if (!isNaN(val)) {
                whereClauses += ` AND precio <= $${placeholderCounter}`;
                queryParams.push(val);
                placeholderCounter++;
            }
        }

        const countQuery = await pool.query(`SELECT COUNT(*) FROM inmobiliaria.propiedades ${whereClauses}`, queryParams);
        const dataQuery = await pool.query(`
            SELECT id_propiedad, referencia, titulo, precio, operacion, superficie_m2 
            FROM inmobiliaria.propiedades ${whereClauses}
            ORDER BY created_at DESC 
            LIMIT $${placeholderCounter} OFFSET $${placeholderCounter + 1}
        `, [...queryParams, limit, offset]);

        res.json({
            meta: { 
                total_registros: parseInt(countQuery.rows[0].count), 
                pagina_actual: page, 
                total_paginas: Math.ceil(countQuery.rows[0].count / limit) || 1 
            },
            data: dataQuery.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en el servidor.' });
    }
};

const getPropiedadById = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM inmobiliaria.propiedades WHERE id_propiedad = $1', [id]);
    rows.length ? res.json({ data: rows[0] }) : res.status(404).json({ error: 'No encontrado' });
};

const createPropiedad = async (req, res) => { /* Tu lógica de INSERT */ res.status(201).json({ msg: "Creado" }); };
const updatePropiedad = async (req, res) => { /* Tu lógica de UPDATE */ res.json({ msg: "Actualizado" }); };
const deletePropiedad = async (req, res) => { /* Tu lógica de DELETE */ res.json({ msg: "Eliminado" }); };

// ¡ESTO ES LO MÁS IMPORTANTE! Debes exportar todas las funciones aquí.
module.exports = {
    getPropiedades,
    getPropiedadById,
    createPropiedad,
    updatePropiedad,
    deletePropiedad
};