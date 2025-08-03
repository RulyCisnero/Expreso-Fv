import { Request, Response } from 'express';
import EncomiendaModel from "../../models/encomienda/encomiendaModel.ts";

const estadosValidos = ['Pendiente', 'Entregada'];
export class EncomiendaController {

    async createEncomienda(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const nuevaEncomienda = await EncomiendaModel.createEncomienda(data);
            res.status(201).json(nuevaEncomienda);
        } catch (error) {
            console.error("❌ Error al crear encomienda:", error);
            res.status(500).json({ message: "Error en el servidor al crear la encomienda" });
        }
    }

    async getEncomiendaById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const encomienda = await EncomiendaModel.getEncomiendaById(id);

            if (!encomienda) {
                res.status(404).json({ message: 'Encomienda no encontrada' });
                return;
            }

            res.status(200).json(encomienda);
        } catch (error) {
            console.error('❌ Error al obtener encomienda por ID:', error);
            res.status(500).json({ message: 'Error en el servidor fetching encomienda' });
        }
    }

    async getAllEncomiendas(req: Request, res: Response): Promise<void> {
        try {
            const encomiendas = await EncomiendaModel.getAllEncomiendas();
            res.status(200).json(encomiendas);
        } catch (error) {
            console.error("❌ Error al obtener encomiendas:", error);
            res.status(500).json({ message: "Error en el servidor fetching encomiendas" });
        }
    }

    async getFilteredEncomiendas(req: Request, res: Response): Promise<void> {
        try {
            const { estado, cliente_id, chofer_id } = req.query;

            const data = {
                estado: req.body.estado as string,
                cliente_id: req.body.cliente_id as number,
                chofer_id: req.body.chofer_id as number
            };

            const encomiendas = await EncomiendaModel.getFilteredEncomiendas(data);
            res.status(200).json(encomiendas);
        } catch (error) {
            console.error('❌ Error al obtener encomiendas filtradas:', error);
            res.status(500).json({ message: 'Error en el servidor al obtener encomiendas filtradas' });
        }
    }

    async updateEncomienda(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;
            const encomiendaActualizada = await EncomiendaModel.updateEncomienda(id, data);

            if (!encomiendaActualizada) {
                res.status(404).json({ message: 'Encomienda no encontrada' });
                return;
            }

            res.status(200).json(encomiendaActualizada);
        } catch (error: any) {
            if (error.code === '23503') {
                res.status(400).json({ error: 'El chofer, cliente u otra referencia indicada no existe.' });
                return;
            }
            console.error("❌ Error al actualizar encomienda:", error);
            res.status(400).json({ error: 'No se especificaron campos válidos para actualizar.' });
            //res.status(400).json({ message: "Error al actualizar la encomienda" });
        }
    }

    async actualizarEstadoEncomienda(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        const { estado, ...rest } = req.body;

        // ✅ Validación 1: Solo "estado"
        if (!estado || Object.keys(rest).length > 0) {
            res.status(400).json({ error: 'Solo se permite modificar el campo "estado".' });
            return;
        }

        // ✅ Validación 2: Estado permitido
        if (!estadosValidos.includes(estado)) {
            res.status(400).json({ error: 'Estado no válido. Debe ser "Pendiente" o "Entregada".' });
            return;
        }

        try {
            const existe = await EncomiendaModel.existeEncomienda(id);
            if (!existe) {
                res.status(404).json({ error: 'Encomienda no encontrada.' });
                return;
            }

            await EncomiendaModel.actualizarEstado(id, estado);
            res.status(200).json({ mensaje: 'Estado actualizado correctamente.' });
        } catch (error) {
            console.error('❌ Error al actualizar estado:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }

    };


    async deleteEncomienda(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const encomiendaEliminada = await EncomiendaModel.deleteEncomienda(id);

            if (!encomiendaEliminada) {
                res.status(404).json({ message: 'Encomienda no encontrada' });
                return;
            }

            res.status(200).json(encomiendaEliminada);
        } catch (error) {
            console.error("❌ Error al eliminar encomienda:", error);
            res.status(500).json({ message: "Error al eliminar la encomienda" });
        }
    }
}

export default new EncomiendaController();
