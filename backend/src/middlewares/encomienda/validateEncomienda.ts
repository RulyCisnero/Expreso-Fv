import { Request, Response, NextFunction } from "express";

export const validarCrearEncomienda = (req: Request, res: Response, next: NextFunction) => {
  const {
    tipo,
    direccion_destino,
    descripcion,
    cliente_id,
    chofer_id,
    origen_id,
    destino_id,
    precio
  } = req.body;

  const errores = [];

  if (!tipo || (tipo !== "ENTRANTE" && tipo !== "SALIENTE")) {
    errores.push("El campo 'tipo' debe ser 'ENTRANTE' o 'SALIENTE'.");
  }

  if (!direccion_destino || typeof direccion_destino !== "string") {
    errores.push("El campo 'direccion_destino' es obligatorio y debe ser un string.");
  }

  if (!descripcion || typeof descripcion !== "string") {
    errores.push("El campo 'descripcion' es obligatorio y debe ser un string.");
  }

  const ids = { cliente_id, chofer_id, origen_id, destino_id };
  for (const [campo, valor] of Object.entries(ids)) {
    if (typeof valor !== "number") {
      errores.push(`El campo '${campo}' es obligatorio y debe ser un número.`);
    }
  }

  if (!precio || isNaN(Number(precio))) {
    errores.push("El campo 'precio' es obligatorio y debe ser un número válido.");
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  next();
};
