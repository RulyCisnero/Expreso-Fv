import pool from '../../database/connectionPostgreSQL.ts';
import { ICliente, IClienteVista } from '../../interfaces/cliente.ts';

class ClienteModel {

    async createCliente(nombre: string, apellido: string, direccion_local: string, telefono: string, email: string, id_localidad: number): Promise<ICliente> {
        const result = await pool.query('INSERT INTO cliente (nombre, apellido, direccion_local, telefono, email,id_localidad) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING *', [nombre, apellido, direccion_local, telefono, email, id_localidad]);
        return result.rows[0];
    };


    async getClienteById(id: number): Promise<IClienteVista | null> {
        const result = await pool.query('SELECT cliente.*, localidad.nombre AS nombre_localidad FROM cliente JOIN localidad ON cliente.id_localidad = localidad.id WHERE cliente.id = $1', [id]);
        return result.rows[0];
    };

    async getAllClientes(): Promise<IClienteVista[]> {
        const result = await pool.query('SELECT cliente.*, localidad.nombre AS nombre_localidad FROM cliente JOIN localidad ON cliente.id_localidad = localidad.id ORDER BY cliente.id ASC');
        return result.rows;
        //SELECT
        //cliente.*,
        //localidad.nombre AS localidad_nombre
        //FROM cliente
        //JOIN localidad ON cliente.id_localidad = localidad.id
    };

    async updateCliente(id: number, nombre: string, apellido: string, direccion_local: string, telefono: string, email: string, id_localidad: number): Promise<ICliente> {
        const result = await pool.query
            ('UPDATE cliente SET nombre = $2, apellido = $3, direccion_local = $4, telefono = $5, email = $6, id_localidad = $7 WHERE id = $1 RETURNING *', [id, nombre, apellido, direccion_local, telefono, email, id_localidad]);
        return result.rows[0];
    };

    async deleteCliente(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [id]);
        return result.rows[0]; // Devuelve el cliente eliminado
    };

    async searchCliente(searchParams: string): Promise<ICliente[]> {
        const { rows } = await pool.query(
            `SELECT * FROM cliente WHERE nombre ILIKE $1 OR apellido ILIKE $1`,
            [`%${searchParams}%`]
        );
        return rows;
    };
};

export default new ClienteModel();
