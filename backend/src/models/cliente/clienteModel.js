import { Pool } from 'pg';
import pool from '../../database/connectionPostgreSQL.js';

class ClienteModel{
    
    async createCliente(clienteData){
        const query =  
        `
        INSERT INTO cliente
        (nombre, apellido, direccion_local, telefono, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `;
        //valores que se insertan en la consulta 
        //data es un objeto que contiene los datos del cliente
        const values = [
            clienteData.nombre,
            clienteData.apellido,
            clienteData.direccion_local,
            clienteData.telefono,
            clienteData.email
        ];
        //ejecuta la consulta y devuelve el resultado utilizando el pool de conexiones
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el cliente creado
    };

    async getClienteById(clienteId){
        const query =  
        `
        SELECT * FROM cliente WHERE id = $1
        `;
        const values = [clienteId];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el cliente encontrado
    };

    async getAllClientes(){
        const query =  
        `
        SELECT * FROM cliente
        `;
        const result = await pool.query(query);
        return result.rows; // Devuelve todos los clientes
    };

    async updateCliente(clienteId, clienteData){
        const query =  
        `
        UPDATE cliente
        SET nombre = $1, apellido = $2, direccion_local = $3, telefono = $4, email = $5
        WHERE id = $6
        RETURNING *
        `;
        const values = [
            clienteData.nombre,
            clienteData.apellido,
            clienteData.direccion_local,
            clienteData.telefono,
            clienteData.email,
            clienteId
        ];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el cliente actualizado
    };

    async deleteCliente(clienteId) {
        const query = `
        DELETE FROM cliente WHERE id = $1
        RETURNING *
        `;
        const values = [clienteId];
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el cliente eliminado
    };
    
    async searchCliente(searchParams) {
        // Implementación de búsqueda de clientes
        // Aquí podrías implementar una función para buscar clientes por nombre, email, etc.
        const {rows} = await pool.query(
            `SELECT * FROM cliente WHERE nombre ILIKE $1 OR apellido ILIKE $1`,
            [`%${searchParams}%`]
        );
        return rows; // Devuelve los clientes encontrados
    };

};

export default new ClienteModel();
