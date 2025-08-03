import { Request, Response } from 'express';
import choferModel from '../../models/chofer/choferModel.ts';
import { IChofer } from '../../interfaces/chofer.ts';

export class ChoferController {
    async createChofer(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, apellido, destino_id } = req.body;
            const newChofer = await choferModel.createChofer(nombre, apellido, destino_id);
            res.status(201).json(newChofer);
        } catch (error) {
            console.error('Error en para crear chofer:', error);
            res.status(500).json({ message: 'Error en el servidor para crear chofer' });
        }
    };

    async getChoferById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const chofer: IChofer | null = await choferModel.getChoferById(id);
            if (!chofer) {
                res.status(404).json({ message: 'Chofer con ese ID no existe' });
                return;
            }
            res.status(200).json(chofer);
        } catch (error) {
            console.error('Error para obtener chofer', error)
            res.status(500).json({ message: 'Error en el servidor al obtener chofer' });
        }
    };

    async getAllChoferes(req: Request, res: Response): Promise<void> {
        try {
            const choferes: IChofer[] = await choferModel.getAllChoferes();
            res.status(200).json(choferes);
        } catch (error) {
            console.error('Error al obtener los choferes: ', error);
            res.status(500).json({ message: 'Error interno del servidor para obtener choferes' });
        }
    };

    async updateChofer(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { nombre, apellido, destino_id } = req.body;

            const updatedChofer = await choferModel.updateChofer(id, nombre, apellido, destino_id);
            if (!updatedChofer) {
                res.status(404).json({ message: 'Chofer no encontrado' });
                return;
            }
            res.status(200).json(updatedChofer);
        } catch (error) {
            console.error('Error al actualizar chofer:', error);
            res.status(500).json({ message: 'Error en el servidor al actualizar chofer' });
        }
    };

    async deleteChofer(req: Request, res: Response): Promise<void> {
        try {
            const choferId = parseInt(req.params.id);
            const deletedChofer: boolean = await choferModel.deleteChofer(choferId);
            if (!deletedChofer) {
                res.status(404).json({ message: 'Chofer no encontrado' });
                return
            }
            res.status(200).json({ message: 'Chofer eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar chofer: ', error)
            res.status(500).json({ message: 'Error en el servidor al eliminar chofer' });
        }
    }
};

export default new ChoferController();
