import pool from '../../database/connectionPostgreSQL.js';
import clienteModel from '../../models/cliente/clienteModel.js';

const createCliente = async (req, res) => {
    try {
        const newCliente = await clienteModel.createCliente(req.body);
        res.status(201).json(newCliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear Cliente' });
    }
};
// Implementación de búsqueda de clientes
// Aquí podrías implementar una función para buscar clientes por nombre, email, etc.
const searchCliente = async (req, res) => {
    try {
        const searchParams = req.query.q;
        const clientes = await clienteModel.searchCliente(searchParams);
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar Clientes' });
    }
};


const getClienteById = async (req, res) => {
    try {
        const clienteId = req.params.id;
        const cliente = await clienteModel.getClienteById(clienteId);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener Cliente' });
    }
};

const getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener Clientes' });
    }
};

const updateCliente = async (req, res) => {
    try {
        const clienteId = req.params.id;
        const updatedCliente = await clienteModel.updateCliente(clienteId, req.body);
        if (!updatedCliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(updatedCliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar Cliente' });
    }
    values.push(clienteId);
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el cliente actualizado
};

const deleteCliente = async (req, res) => {
    try {
        const clienteId = req.params.id;
        const deletedCliente = await clienteModel.deleteCliente(clienteId);
        if (!deletedCliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(deletedCliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar Cliente' });
    }
};



export default {
    createCliente,
    getClienteById,
    getAllClientes,
    updateCliente,
    deleteCliente,
    searchCliente,
};