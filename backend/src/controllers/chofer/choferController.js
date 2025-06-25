import pool from '../../database/connectionPostgreSQL.js';
import choferModel from '../../models/chofer/choferModel.js';

const createChofer = async (req, res) => {
    try {
        console.log('📦 Datos recibidos en el body:', req.body);
        const newChofer = await choferModel.createChofer(req.body);
        res.status(201).json(newChofer);
    } catch (error) {
         console.error('❌ Error en createChofer:', error.message);
        res.status(500).json({ error: 'Error para crear chofer' });
    }
};

const getChoferById = async (req, res) => {
    try {
        const choferId = req.params.id;
        const chofer = await choferModel.getChoferById(choferId);
        if (!chofer) {
            return res.status(404).json({ error: 'Chofer no encontrado' });
        }
        res.status(200).json(chofer);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener chofer' });
    }
};

const getAllChoferes = async (req, res) => {
    try {
        const choferes = await choferModel.getAllChoferes();
        res.status(200).json(choferes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener choferes' });
    }
};

const updateChofer = async (req, res) => {
    try {
        const choferId = req.params.id;
        const updatedChofer = await choferModel.updateChofer(choferId, req.body);
        if (!updatedChofer) {
            return res.status(404).json({ error: 'Chofer no encontrado' });
        }
        res.status(200).json(updatedChofer);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar chofer' });
    }
        values.push(choferId);
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el chofer actualizado

};

const deleteChofer = async (req, res) => {
    try {
        const choferId = req.params.id;
        const deletedChofer = await choferModel.deleteChofer(choferId);
        if (!deletedChofer) {
            return res.status(404).json({ error: 'Chofer no encontrado' });
        }
        res.status(200).json(deletedChofer);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar chofer' });
    }
};

export default {
    createChofer,
    getChoferById,
    getAllChoferes,
    updateChofer,
    deleteChofer
};