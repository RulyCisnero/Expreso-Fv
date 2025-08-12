import pool from '../../database/connectionPostgreSQL.js';
//import { IChofer } from '../../interfaces/chofer.ts';
import { IChofer, IChoferVista } from '../../interfaces/Index.ts';

class ChoferModel {
    async createChofer(choferData: IChofer): Promise<IChoferVista> {
        // 1. Insertar en la base de datos usando solo el ID
        const insertQuery = `
        INSERT INTO chofer (nombre, apellido, destino_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
        const insertValues = [
            choferData.nombre,
            choferData.apellido,
            choferData.destino_id
        ];

        const insertResult = await pool.query(insertQuery, insertValues);
        const newId = insertResult.rows[0].id;

        // 2. Obtener el chofer recién creado con todos sus datos relacionados
        return this.getChoferById(newId);
    }

    async getChoferById(id: number): Promise<IChoferVista> {
        const query = `
        SELECT 
            ch.id,
            ch.nombre,
            ch.apellido,
            loc.id AS localidad_id,
            loc.nombre AS localidad_nombre
        FROM chofer ch
        JOIN localidad loc ON ch.destino_id = loc.id
        WHERE ch.id = $1;
    `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error("Chofer no encontrado");
        }

        const row = result.rows[0];

        return {
            id: row.id,
            nombre: row.nombre,
            apellido: row.apellido, 
            localidad:{
                id: row.localidad_id,
                nombre: row.localidad_nombre
            }
        };
    }

    async getAllChoferes(): Promise<IChoferVista[]> {
        const query = `
        SELECT 
            ch.id,
            ch.nombre,
            ch.apellido,
            loc.id AS localidad_id,
            loc.nombre AS localidad_nombre
        FROM chofer ch
        JOIN localidad loc ON ch.destino_id = loc.id
        ORDER BY ch.id ASC
    `;
        const result = await pool.query(query);

        return result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            apellido: row.apellido,
            localidad: {
                id: row.localidad_id,
                nombre: row.localidad_nombre
            }
        }));
    };

    async updateChofer(id: number, nombre: string, apellido: string, destino_id: number): Promise<IChofer> {
        const result = await pool.query('UPDATE chofer SET nombre = $1, apellido = $2, destino_id = $3 WHERE id = $4 RETURNING *', [nombre, apellido, destino_id, id]);
        return result.rows[0]; // Devuelve el chofer actualizado
    };

    async deleteChofer(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM chofer WHERE id = $1', [id]);
        if (result.rowCount !== null && result.rowCount > 0) {
            return true;
        }
        return false;
    };
};

export default new ChoferModel();