/**
 * Controlador para la gestión de propiedades inmobiliarias.
 * Versión final: Lógica de filtros encapsulada y segura.
 */
const pool = require('../config/db');

const controller = {
    getPropiedades: async (req, res) => {
        try {
            const { operacion, precio_max, barrio, search, page = 1 } = req.query;
            const limit = 9;
            const offset = (page - 1) * limit;

            let whereClauses = ["deleted_at IS NULL"];
            const values = [];

            // 1. Filtro de búsqueda
            if (search && search !== 'undefined' && search.trim() !== '') {
                values.push(`%${search}%`);
                whereClauses.push(`titulo ILIKE $${values.length}`);
            }

            if (operacion && operacion !== 'Todos los regímenes' && operacion !== 'undefined') {
    values.push(operacion.trim());
    // Usamos ILIKE para comparar sin importar mayúsculas/minúsculas
    // y forzamos a texto para evitar problemas con el tipo ENUM
    whereClauses.push(`operacion::text ILIKE $${values.length}`);
}

            // 3. Filtro de precio
            if (precio_max && precio_max !== 'Cualquier rango' && precio_max !== 'undefined') {
                values.push(parseInt(precio_max));
                whereClauses.push(`precio <= $${values.length}`);
            }

            // 4. Filtro de barrio
            if (barrio && barrio !== 'Todos os bairros' && barrio !== 'undefined') {
                values.push(barrio);
                whereClauses.push(`barrio = $${values.length}`);
            }

            const whereSQL = "WHERE " + whereClauses.join(" AND ");
            const baseQuery = `FROM inmobiliaria.vw_propiedades_detalladas ${whereSQL}`;
            
            // Ejecutar conteo
            const countResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`, values);
            const totalRegistros = parseInt(countResult.rows[0].count);

            // Ejecutar consulta con paginación
            const dataResult = await pool.query(
                `SELECT * ${baseQuery} ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`, 
                [...values, limit, offset]
            );

            res.json({
                meta: { 
                    total_registros: totalRegistros, 
                    pagina_actual: parseInt(page), 
                    total_paginas: Math.ceil(totalRegistros / limit) 
                },
                data: dataResult.rows
            });
        } catch (error) {
            console.error("ERROR CRÍTICO EN SQL:", error);
            res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    // ... los demás métodos (getPropiedadById, createPropiedad, etc) se mantienen igual
    getPropiedadById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM inmobiliaria.vw_propiedades_detalladas WHERE id = $1', [id]);
            if (result.rows.length === 0) return res.status(404).json({ mensaje: "No encontrada" });
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createPropiedad: async (req, res) => {
        try {
            const { usuario_id, tipo_propiedad_id, referencia, titulo, precio, operacion, barrio } = req.body;
            const query = 'INSERT INTO inmobiliaria.propiedades (usuario_id, tipo_propiedad_id, referencia, titulo, precio, operacion, barrio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
            const result = await pool.query(query, [usuario_id, tipo_propiedad_id, referencia, titulo, precio, operacion, barrio]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePropiedad: async (req, res) => {
        try {
            const { id } = req.params;
            const { titulo } = req.body;
            const result = await pool.query('UPDATE inmobiliaria.propiedades SET titulo = $1 WHERE id = $2 RETURNING *', [titulo, id]);
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deletePropiedad: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('UPDATE inmobiliaria.propiedades SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
            res.json({ mensaje: "Propiedad eliminada" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = controller;