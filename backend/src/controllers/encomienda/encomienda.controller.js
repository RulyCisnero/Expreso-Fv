import pool from "../../database/connectionPostgreSQL.js";
import EncomiendaModel from "../../models/encomienda/encomiendaModel.js";

const createEncomienda = async (req, res) => {
    const data = req.body;

    // Validaciones mínimas
    if (!data.tipo || !['SALIENTE', 'ENTRANTE'].includes(data.tipo)) {
        return res.status(400).json({ error: "Tipo inválido. Debe ser 'SALIENTE' o 'ENTRANTE'" });
    }
    if (!data.estado || !['Pendiente', 'En tránsito', 'Lista para reparto', 'Entregada'].includes(data.estado)) {
        return res.status(400).json({ error: "Estado inválido" });
    }
    if (!data.origen || !data.destino || !data.direccion_destino || !data.cliente_id) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Validar existencia de cliente y chofer
    const cliente = await pool.query('SELECT id FROM cliente WHERE id = $1', [data.cliente_id]);
    if (cliente.rowCount === 0) {
        return res.status(400).json({ error: "Cliente no existe" });
    }

    if (data.chofer_id) {
        const chofer = await pool.query('SELECT id FROM chofer WHERE id = $1', [data.chofer_id]);
        if (chofer.rowCount === 0) {
            return res.status(400).json({ error: "Chofer no existe" });
        }
    }

    try {
        const nuevaEncomienda = await EncomiendaModel.createEncomienda(data);
        res.status(201).json(nuevaEncomienda);
    } catch (error) {
        console.error("❌ Error al crear encomienda:", error.message);
        res.status(500).json({ error: "Error al crear la encomienda" });
    }
};

const getEncomiendaById = async (req, res) => {
    try {
        const { id } = req.params;
        const encomienda = await EncomiendaModel.getEncomiendaById(id);

        if (!encomienda) {
            return res.status(404).json({ error: 'Encomienda no encontrada' });
        }

        res.status(200).json(encomienda);
    } catch (error) {
        console.error('❌ Error al obtener encomienda por ID:', error.message);
        res.status(500).json({ error: 'Error fetching encomienda' });
    }
};

const getAllEncomiendas = async (req, res) => {
    try {
        const encomiendas = await EncomiendaModel.getAllEncomiendas();
        res.status(200).json(encomiendas);
    } catch (error) {
        console.error("❌ Error al obtener encomiendas:", error.message);
        res.status(500).json({ error: "Error fetching encomiendas" });
    }
};

const getFilteredEncomiendas = async (req, res) => {
    try {
        const { estado, cliente_id, chofer_id } = req.query;

        const filtros = {
            estado: estado || null,
            cliente_id: cliente_id ? parseInt(cliente_id) : null,
            chofer_id: chofer_id ? parseInt(chofer_id) : null
        };

        const encomiendas = await EncomiendaModel.getFilteredEncomiendas(filtros);
        res.status(200).json(encomiendas);
    } catch (error) {
        console.error('❌ Error al obtener encomiendas filtradas:', error.message);
        res.status(500).json({ error: 'Error al obtener encomiendas' });
    }
};

const updateEncomienda = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log('📦 Datos recibidos en el body:', data);

        // Validaciones mínimas
        if (!data.tipo || !['SALIENTE', 'ENTRANTE'].includes(data.tipo)) {
            return res.status(400).json({ error: "Tipo inválido. Debe ser 'SALIENTE' o 'ENTRANTE'" });
        }
        if (!data.estado || !['Pendiente', 'En tránsito', 'Lista para reparto', 'Entregada'].includes(data.estado)) {
            return res.status(400).json({ error: "Estado inválido" });
        }
        if (!data.origen || !data.destino || !data.direccion_destino || !data.cliente_id) {
            console.log('📦 Datos recibidos en el body:', data.origen,data.destino,data.direccion_destino,data.cliente_id);
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Validar existencia de cliente y chofer
        const cliente = await pool.query('SELECT id FROM cliente WHERE id = $1', [data.cliente_id]);
        if (cliente.rowCount === 0) {
            return res.status(400).json({ error: "Cliente no existe" });
        }

        if (data.chofer_id) {
            const chofer = await pool.query('SELECT id FROM chofer WHERE id = $1', [data.chofer_id]);
            if (chofer.rowCount === 0) {
                return res.status(400).json({ error: "Chofer no existe" });
            }
        }

        const encomiendaActualizada = await EncomiendaModel.updateEncomienda(id, data);
        if (!encomiendaActualizada) {
            return res.status(404).json({ error: 'Encomienda no encontrada' });
        }

        res.status(200).json(encomiendaActualizada);
    } catch (error) {
        console.error("❌ Error al actualizar encomienda:", error.message);
        res.status(500).json({ error: "Error al actualizar la encomienda" });
    }
};

const deleteEncomienda = async (req, res) => {
    try {
        const { id } = req.params;
        const encomiendaEliminada = await EncomiendaModel.deleteEncomienda(id);

        if (!encomiendaEliminada) {
            return res.status(404).json({ error: 'Encomienda no encontrada' });
        }

        res.status(200).json(encomiendaEliminada);
    } catch (error) {
        console.error("❌ Error al eliminar encomienda:", error.message);
        res.status(500).json({ error: "Error al eliminar la encomienda" });
    }
};   

export default {
    createEncomienda,
    getFilteredEncomiendas,
    getAllEncomiendas,
    getEncomiendaById,
    updateEncomienda,
    deleteEncomienda
};