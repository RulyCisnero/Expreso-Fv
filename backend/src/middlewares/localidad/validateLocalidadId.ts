import { Request, Response, NextFunction } from 'express';

/**
 * Valida que el ID recibido por parámetro sea un número válido y mayor a cero.
 */
export function validateLocalidadId(req: Request, res: Response, next: NextFunction) : Response | void {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID de la localidad debe ser un número válido y positivo.' });
  }

  next();
};

