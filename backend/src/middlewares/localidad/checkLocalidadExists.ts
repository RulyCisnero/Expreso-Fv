import { Request, Response, NextFunction } from 'express';
import  pool  from '../../database/connectionPostgreSQL.ts';

/**
 * Verifica en la base de datos que la localidad con el ID proporcionado exista.
 * Si no existe, devuelve 404.
 */
export async function checkLocalidadExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = Number(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM localidad WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'No existe la localidad con ese ID.' });
      return;
    }
    next();
  } catch (error) {
    console.error('Error al verificar la localidad:', error);
    res.status(500).json({ error: 'Error interno del servidor al verificar la localidad.' });
  }
}

/**
 * Verifica si ya existe una localidad con el mismo nombre (ignorando mayúsculas/minúsculas).
 * Si existe, devuelve 409 (conflicto).
 */
export async function checkLocalidadNombreDuplicado(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { nombre } = req.body;
  try {
    const result = await pool.query('SELECT id FROM localidad WHERE LOWER(nombre) = LOWER($1)', [nombre.trim()]);
    if (result && result.rowCount && result.rowCount > 0) {
      res.status(409).json({ error: 'Ya existe una localidad con ese nombre.' });
      return;
    }
    next();
  } catch (error) {
    console.error('Error al verificar duplicados de localidad:', error);
    res.status(500).json({ error: 'Error interno al verificar nombre de localidad.' });
  }
}

