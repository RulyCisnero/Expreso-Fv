import { Request, Response, NextFunction } from 'express';

export const validateCreateCliente = (req: Request, res: Response, next: NextFunction) => {
  const { nombre, apellido, direccion_local, telefono, email, id_localidad } = req.body;

  if (!nombre || !apellido || !direccion_local || !telefono || !email || !id_localidad) {
    return res.status(400).json({ error: 'Faltan campos requeridos para crear un cliente' });
  }

  // Podés hacer validaciones más específicas si querés, por ejemplo:
  if (typeof id_localidad !== 'number') {
    return res.status(400).json({ error: 'El campo id_localidad debe ser un número' });
  }

  next();
};


export const validateSearchCliente = (req: Request, res: Response, next: NextFunction) => {
  const searchParams = req.query.q;

  if (!searchParams || typeof searchParams !== 'string') {
    return res.status(400).json({ error: 'El parámetro de búsqueda "q" es obligatorio' });
  }

  next();
};

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  next();
};
