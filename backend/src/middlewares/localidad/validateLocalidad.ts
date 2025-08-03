import { Request, Response, NextFunction } from 'express';

/**
 * Valida el cuerpo del request para asegurar que el campo 'nombre' esté presente,
 * sea una cadena de texto y no esté vacío.
 */
export function validateLocalidadData(req: Request, res: Response, next: NextFunction): Response | void {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la localidad es obligatorio y debe ser una cadena válida.' });
  }

  next();
}
