import pool from '../../database/connectionPostgreSQL.js';
import { Localidad } from '../../interfaces/localidad.ts';

class LocalidadModel {
    //Obtener todas las localidades
    async getAllLocalidades(): Promise<Localidad[]> {
        const result = await pool.query('SELECT * FROM localidad ORDER BY id ASC');
        return result.rows;
    }

    // Obtener una localidad por ID
    async getLocalidadById(id: number): Promise<Localidad | null> {
        const result = await pool.query('SELECT * FROM localidad WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    //Crear una nueva localidad
    async createLocalidad(nombre: string): Promise<Localidad> {
        const result = await pool.query('INSERT INTO localidad (nombre) VALUES ($1) RETURNING *', [nombre]);
        return result.rows[0];
    }

    //Actualizar una localidad por ID
    async updateLocalidad(id: number, nombre: string): Promise<Localidad | null> {
        const result = await pool.query('UPDATE localidad SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        return result.rows[0] || null;
    }

    //Eliminar localidad por ID
    async deleteLocalidad(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM localidad WHERE id = $1', [id]);
        if (result.rowCount !== null && result.rowCount > 0) {
            return true;
        }
        return false;
    }
};
export default new LocalidadModel();
