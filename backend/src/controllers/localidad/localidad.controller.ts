import { Request, Response } from 'express';
import localidadModel from '../../models/localidad/localidadModel.ts';
import { Localidad } from '../../interfaces/localidad.ts';

export class LocalidadController {
    //Obtener todas las localidades
    async getAllLocalidades(req: Request, res: Response): Promise<void> {
        try {
            const localidades: Localidad[] = await localidadModel.getAllLocalidades();
            res.status(200).json(localidades);
        } catch (error) {
            console.error('Error al obtener localidades:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Obtener una localidad por su ID
    async getLocalidadById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const localidad: Localidad | null = await localidadModel.getLocalidadById(id);
            if (!localidad) {
                res.status(404).json({ message: 'Localidad no encontrada' });
                return;
            }
            res.status(200).json(localidad);
        } catch (error) {
            console.error('Error al obtener localidad por ID:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Crear una nueva localidad
    async createLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const { nombre } = req.body;
            if (!nombre) {
                res.status(400).json({ message: 'El campo "nombre" es obligatorio' });
                return;
            }
            const nuevaLocalidad: Localidad = await localidadModel.createLocalidad(nombre);
            res.status(201).json(nuevaLocalidad);
        } catch (error) {
            console.error('Error al crear localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Editar localidad
    async updateLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { nombre } = req.body;

            const update = await localidadModel.updateLocalidad(id, nombre);
            if (update) {
                res.status(200).json({ message: 'Localidad actualizada correctamente' });
            } else {
                res.status(404).json({ message: 'Localidad no encontrada' });
            }
        } catch (error) {
            console.error('Error al actualizar localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    // Eliminar localidad
    async deleteLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted: boolean = await localidadModel.deleteLocalidad(id);
            if (!deleted) {
                res.status(404).json({ message: 'Localidad no encontrada' });
                return;
            }
            res.status(200).json({ message: 'Localidad eliminada correctamente' })

        } catch (error) {
            console.error('Error al eliminar localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}
export default new LocalidadController();