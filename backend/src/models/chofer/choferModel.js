import pool from '../../database/connectionPostgreSQL.js';

class ChoferModel {
    async createChofer(choferData) {
        const query =
            `
        INSERT INTO chofer
        (nombre, destinos)
        VALUES ($1, $2)
        RETURNING *
        `;

        const values = [
            choferData.nombre,
            choferData.destinos
        ];

        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el chofer creado
    };

    async getChoferById(choferId) {
        const query =
            `
        SELECT * FROM chofer WHERE id = $1
        `;
        const values = [choferId];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el chofer encontrado
    };

    async getAllChoferes() {
        const query =
            `
        SELECT * FROM chofer
        `;
        const result = await pool.query(query);
        return result.rows; // Devuelve todos los choferes
    };

    async updateChofer(choferId, choferData) {
        const query =
            `
        UPDATE chofer
        SET nombre = $1, destinos = $2
        WHERE id = $3
        RETURNING *
        `;
        const values = [
            choferData.nombre,
            choferData.destinos,
            choferId
        ];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el chofer actualizado
    };

    async deleteChofer(choferId) {
        const query =
            `
        DELETE FROM chofer WHERE id = $1
        RETURNING *
        `;
        const values = [choferId];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el chofer eliminado  
    };
};
export default new ChoferModel();