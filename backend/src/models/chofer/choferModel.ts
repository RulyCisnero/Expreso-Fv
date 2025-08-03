import pool from '../../database/connectionPostgreSQL.js';
import { IChofer } from '../../interfaces/chofer.ts';

class ChoferModel {
    async createChofer(nombre: String, apellido: String, destino_id: number): Promise<IChofer> {
     const result = await pool.query('INSERT INTO chofer (nombre, apellido, destino_id) VALUES ($1, $2, $3) RETURNING *', [nombre, apellido, destino_id]);
     return result.rows[0];
    };

    async getChoferById(id: number): Promise<IChofer | null>  {
        const result = await pool.query('SELECT * FROM chofer WHERE id = $1', [id]);
        return result.rows[0] || null;
    };

    async getAllChoferes(): Promise<IChofer[]> {
        const result = await pool.query('SELECT * FROM chofer ORDER BY id ASC');
        return result.rows;
    };

    async updateChofer(id: number, nombre: string, apellido: string, destino_id: number): Promise<IChofer> {
        const result = await pool.query('UPDATE chofer SET nombre = $1, apellido = $2, destino_id = $3 WHERE id = $4 RETURNING *', [nombre, apellido, destino_id, id]);
        return result.rows[0]; // Devuelve el chofer actualizado
    };

    async deleteChofer(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM chofer WHERE id = $1',[id]);
          if (result.rowCount !== null && result.rowCount > 0) {
            return true;
        }
        return false;  
    };
};

export default new ChoferModel();