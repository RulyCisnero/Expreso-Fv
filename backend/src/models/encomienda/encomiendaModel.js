import pool from '../../database/connectionPostgreSQL.js';


class EncomiendaModel {
    async createEncomienda(encomiendaData) {
        const query =
            `
        INSERT INTO encomienda (tipo, origen, destino, direccion_destino, estado, descripcion, cliente_id, chofer_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `;
        const values = [
            encomiendaData.tipo,
            encomiendaData.origen,
            encomiendaData.destino,
            encomiendaData.direccion_destino,
            encomiendaData.estado,
            encomiendaData.descripcion,
            encomiendaData.cliente_id,
            encomiendaData.chofer_id

        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    };

    async getEncomiendaById(id) {
        const query = `
        SELECT 
            e.id, e.tipo, e.origen, e.destino, e.direccion_destino,
            e.estado, e.fecha_creacion, e.descripcion,
            c.id AS cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, 
            c.direccion_local AS cliente_direccion_local, c.telefono AS cliente_telefono,
            ch.id AS chofer_id, ch.nombre AS chofer_nombre, ch.destinos AS chofer_destinos
        FROM encomienda e
        JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        WHERE e.id = $1
    `;
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) return null;
        const row = result.rows[0];

        return {
            id: row.id,
            tipo: row.tipo,
            origen: row.origen,
            destino: row.destino,
            direccion_destino: row.direccion_destino,
            estado: row.estado,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            cliente: {
                id: row.cliente_id,
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                direccion_local: row.cliente_direccion_local,
                telefono: row.cliente_telefono,
            },
            chofer: row.chofer_id ? {
                id: row.chofer_id,
                nombre: row.chofer_nombre,
                destinos: row.chofer_destinos
            } : null
        };
    };

    async getAllEncomiendas() {
        const query =
            `
        SELECT 
            e.id, e.tipo, e.origen, e.destino, e.direccion_destino,
            e.estado, e.fecha_creacion, e.descripcion,
            c.id AS cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, 
            c.direccion_local AS cliente_direccion_local, c.telefono AS cliente_telefono,
            ch.id AS chofer_id, ch.nombre AS chofer_nombre, ch.destinos AS chofer_destinos
        FROM encomienda e
        JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        ORDER BY e.id ASC;
    `;

        const result = await pool.query(query);

        // Transformar a JSON estructurado
        return result.rows.map(row => ({
            id: row.id,
            tipo: row.tipo,
            origen: row.origen,
            destino: row.destino,
            direccion_destino: row.direccion_destino,
            estado: row.estado,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            cliente: {
                id: row.cliente_id,
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                direccion_local: row.cliente_direccion_local,
                telefono: row.cliente_telefono
            },
            chofer: row.chofer_id ? {
                id: row.chofer_id,
                nombre: row.chofer_nombre,
                destinos: row.chofer_destinos
            } : null
        }));
    };

    // Filtrar encomiendas por estado, cliente_id y chofer_id
    async getFilteredEncomiendas({ estado, cliente_id, chofer_id }) {
        let query = `
        SELECT 
            e.id, e.tipo, e.origen, e.destino, e.direccion_destino,
            e.estado, e.fecha_creacion, e.descripcion,
            c.id AS cliente_id, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, c.direccion_local AS cliente_direccion_local, c.telefono AS cliente_telefono,
            ch.id AS chofer_id, ch.nombre AS chofer_nombre, ch.destinos AS chofer_destinos
        FROM encomienda e
        JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
    `;
        const conditions = [];
        const values = [];
        if (estado) {
            values.push(estado);
            conditions.push(`e.estado = $${values.length}`);
        }

        if (cliente_id) {
            values.push(cliente_id);
            conditions.push(`e.cliente_id = $${values.length}`);
        }

        if (chofer_id) {
            values.push(chofer_id);
            conditions.push(`e.chofer_id = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }
        query += ' ORDER BY e.id DESC';
        const result = await pool.query(query, values);

        return result.rows.map(row => ({
            id: row.id,
            tipo: row.tipo,
            origen: row.origen,
            destino: row.destino,
            direccion_destino: row.direccion_destino,
            estado: row.estado,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            cliente: {
                id: row.cliente_id,
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                direccion_local: row.cliente_direccion_local,
                telefono: row.cliente_telefono,
            },
            chofer: row.chofer_id ? {
                id: row.chofer_id,
                nombre: row.chofer_nombre,
                destinos: row.chofer_destinos
            } : null
        }));
    };

    async updateEncomienda(id, data) {
        const query = `
        UPDATE encomienda
        SET tipo = $1, origen = $2, destino = $3, direccion_destino = $4,
            estado = $5, descripcion = $6, cliente_id = $7, chofer_id = $8
        WHERE id = $9
        RETURNING *
        `;
        const values = [
            data.tipo,
            data.origen,
            data.destino,
            data.direccion_destino,
            data.estado,
            data.descripcion,
            data.cliente_id,
            data.chofer_id || null,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    };

    async deleteEncomienda(id) {
        const query = `
        DELETE FROM encomienda
        WHERE id = $1
        RETURNING *
        `;
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return null; // No se encontró la encomienda para eliminar
        }
        return result.rows[0]; // Retorna la encomienda eliminada
    };

};
export default new EncomiendaModel();