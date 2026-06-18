const pool = require('../config/db');

const controller = {
    getPropiedades: async (req, res) => {
        // Obtenemos un cliente del pool y lo liberamos al terminar
        const client = await pool.connect();
        
        try {
            const { operacion, precio_max, barrio, search, page = 1 } = req.query;
            const limit = 9;
            const offset = (page - 1) * limit;

            let whereClauses = ["deleted_at IS NULL"];
            const values = [];

            if (search && search.trim() !== '') {
                values.push(`%${search}%`);
                whereClauses.push(`titulo ILIKE $${values.length}`);
            }

            if (operacion && operacion !== 'Todos') {
                values.push(operacion);
                whereClauses.push(`operacion::text ILIKE $${values.length}`);
            }

            if (precio_max && precio_max !== 'Cualquier') {
                values.push(parseInt(precio_max));
                whereClauses.push(`precio <= $${values.length}`);
            }

            if (barrio && barrio !== 'Todos') {
                values.push(barrio);
                whereClauses.push(`barrio = $${values.length}`);
            }

            const whereSQL = "WHERE " + whereClauses.join(" AND ");
            const baseQuery = `FROM vw_propiedades_detalladas ${whereSQL}`;
            
            // Usamos el cliente específico para evitar el DeprecationWarning
            const countResult = await client.query(`SELECT COUNT(*) ${baseQuery}`, values);
            const totalRegistros = parseInt(countResult.rows[0].count);

            const query = `SELECT * ${baseQuery} ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            const dataResult = await client.query(query, [...values, limit, offset]);

            res.json({
                meta: { 
                    total_registros: totalRegistros, 
                    pagina_actual: parseInt(page), 
                    total_paginas: Math.ceil(totalRegistros / limit) 
                },
                data: dataResult.rows
            });
        } catch (error) {
            console.error("ERRO CRÍTICO NA QUERY:", error);
            res.status(500).json({ error: "Erro no servidor", details: error.message });
        } finally {
            client.release();
        }
    },
    // 2. Obtener por ID
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

    // 3. Crear
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

    // 4. Actualizar
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

    // 5. Eliminar
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