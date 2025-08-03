import { Request, Response } from 'express';
import pool from '../../database/connectionPostgreSQL.ts';
import clienteModel from '../../models/cliente/clienteModel.ts';
import { IChofer } from '../../interfaces/chofer.ts';
import { ICliente, IClienteVista } from '../../interfaces/cliente.ts';

export class ClienteController {

    async createCliente(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, apellido, direccion_local, telefono, email, id_localidad } = req.body;
            const newCliente = await clienteModel.createCliente(nombre, apellido, direccion_local, telefono, email, id_localidad);
            res.status(201).json(newCliente);
        } catch (error) {
            console.error('Error al crear un cliente: ', error)
            res.status(500).json({ message: 'Error del servidor al crear Cliente' });
        }
    };

    async searchCliente(req: Request, res: Response): Promise<void> {
        try {
            const searchParams = req.query.q;
            // Verificamos que sea string (por seguridad adicional)
            if (typeof searchParams !== 'string') {
                res.status(400).json({ message: 'Parámetro de búsqueda inválido' });
                return;
            }
            const clientes = await clienteModel.searchCliente(searchParams);
            res.status(200).json(clientes);
        } catch (error) {
            console.error('Error en searchCliente:', error);
            res.status(500).json({ message: 'Error al buscar clientes' });
        }
    };

    async getClienteById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const cliente: IClienteVista | null = await clienteModel.getClienteById(id);
            if (!cliente) {
                res.status(404).json({ message: 'Cliente no encontrado' });
                return;
            }
            res.status(200).json(cliente);
        } catch (error) {
            console.error('Error al obtener Cliente: ', error)
            res.status(500).json({ message: 'Error en el servidor al obtener Cliente' });
        }
    };

    async getAllClientes(req: Request, res: Response): Promise<void> {
        try {
            const clientes: IClienteVista[] = await clienteModel.getAllClientes();
            res.status(200).json(clientes);
        } catch (error) {
            console.error('Error al obtener Clientes: ', error)
            res.status(500).json({ message: 'Error en el servidor al obtener Clientes' });
        }
    };

    async updateCliente(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { nombre, apellido, direccion_local, telefono, email, id_localidad } = req.body;
            const updatedCliente = await clienteModel.updateCliente(id, nombre, apellido, direccion_local, telefono, email, id_localidad);
            if (!updatedCliente) {
                res.status(404).json({ message: 'Cliente no encontrado' });
                return
            }
            res.status(200).json(updatedCliente);
        } catch (error) {
            console.error('Error al actualizar el Cliente: ', error);
            res.status(500).json({ message: 'Error en el servidor al actualizar Cliente' });
        }
        //values.push(clienteId);
        //const result = await pool.query(query, values);
        //return result.rows[0]; // Devuelve el cliente actualizado
    };

    async deleteCliente(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deletedCliente: boolean = await clienteModel.deleteCliente(id);
            if (!deletedCliente) {
                res.status(404).json({ message: 'Cliente no encontrado' });
                return;
            }
            res.status(200).json(deletedCliente);
        } catch (error) {
            console.error('Error al eliminar el Cliente: ', error)
            res.status(500).json({ message: 'Error al eliminar Cliente' });
        }
    };
};
export default new ClienteController();