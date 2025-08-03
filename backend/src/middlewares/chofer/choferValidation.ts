import { Request, Response, NextFunction } from 'express';
import pool from '../../database/connectionPostgreSQL.ts';

// Validar campos requeridos en el body
export function validarCamposChofer(req: Request, res: Response, next: NextFunction): void {
     const { nombre, apellido, destino_id } = req.body;
    if (
        !nombre || typeof nombre !== 'string' || nombre.trim() === '' ||
        !apellido || typeof apellido !== 'string' || apellido.trim() === '' ||
        isNaN(Number(destino_id)) || Number(destino_id) <= 0
    ) {
        res.status(400).json({ message: 'Los campos nombre, apellido y destino_id deben estar completos y ser válidos.' });
        return;
    }
    next();
}

/**
Valida que el ID proporcionado en los parámetros de la URL sea un número entero válido.
*/
export function validarIdParam(req: Request, res: Response, next: NextFunction): void {
    const id = parseInt(req.params.id);
    if (isNaN(id)|| id <= 0) {
        res.status(400).json({ message: 'El ID debe ser un número válido y positivo' });
        return;
    }
    next();
}

/**
Verifica que el chofer con el ID dado exista en la base de datos.
*/
export async function checkChoferExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT id FROM chofer WHERE id = $1', [id]);
        if (!result.rowCount) {
            res.status(404).json({ error: 'No existe un chofer con ese ID.' });
            return;
        }
        next();
    } catch (error) {
        console.error('Error al verificar existencia del chofer:', error);
        res.status(500).json({ error: 'Error interno al verificar el chofer.' });
    }
}

/**
 * Verifica que el destino_id proporcionado en el body exista en la base de datos.
 * Si no existe, devuelve un error 404.
 */

export async function checkDestinoExiste(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { destino_id } = req.body;
    try {
        const result = await pool.query('SELECT id FROM localidad WHERE id = $1', [destino_id]);
        if (!result.rowCount) {
            res.status(404).json({ error: 'El destino_id no corresponde a una localidad existente.' });
            return;
        }
        next();
    } catch (error) {
        console.error('Error al verificar destino_id:', error);
        res.status(500).json({ error: 'Error interno al verificar destino_id.' });
    }
}
