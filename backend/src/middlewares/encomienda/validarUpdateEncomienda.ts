import { Request, Response, NextFunction } from 'express';
import pool from '../../database/connectionPostgreSQL.ts' 
import { IEncomienda } from '../../interfaces/Index.ts';

/**
 * Validar que solo se modifiquen los campos permitidos.
 * No permitir modificaciones si la encomienda ya fue entregada.
 *
 * Validar tipos de datos y valores permitidos.
 *
 * Evitar campos extraños o campos no explícitamente permitidos.
 * 
 */
export function validarUpdateEncomienda(req: Request, res: Response, next: NextFunction) {
    const noPermitidos = ["tipo", "id", "fecha_creacion"];
    const data = req.body;

    for (const campo of Object.keys(data)) {
        if (noPermitidos.includes(campo)) {
            return res.status(400).json({
                message: `Campo no permitido en actualización: ${campo}`
            });
        }
    }

    next();
}


export const validarCamposEncomiendaPut = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const data = req.body;

  const camposPermitidos: (keyof IEncomienda)[] = ['estado', 'descripcion', 'direccion_destino', 'chofer_id'];

  // Paso 1: Validar que solo haya campos permitidos
  const camposData = Object.keys(data);
  const camposNoPermitidos = camposData.filter(campo => !camposPermitidos.includes(campo as keyof IEncomienda));

  if (camposNoPermitidos.length > 0) {
    return res.status(400).json({
      error: `Los siguientes campos no están permitidos para modificar: ${camposNoPermitidos.join(', ')}`,
    });
  }

  // Paso 2: Validaciones específicas de campos
  if (data.estado && !['Pendiente', 'Entregada'].includes(data.estado)) {
    return res.status(400).json({ error: "El campo 'estado' solo puede ser 'Pendiente' o 'Entregada'." });
  }

  if (data.chofer_id && typeof data.chofer_id !== 'number') {
    return res.status(400).json({ error: "El campo 'chofer_id' debe ser un número." });
  }

  if (data.direccion_destino && typeof data.direccion_destino !== 'string') {
    return res.status(400).json({ error: "El campo 'direccion_destino' debe ser un string." });
  }

  if (data.descripcion && typeof data.descripcion !== 'string') {
    return res.status(400).json({ error: "El campo 'descripcion' debe ser un string." });
  }

  // Paso 3: Consultar la encomienda para ver su estado actual
  try {
    const result = await pool.query('SELECT estado FROM encomienda WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Encomienda no encontrada' });
    }

    const estadoActual = result.rows[0].estado;

    if (estadoActual === 'Entregada') {
      return res.status(403).json({ error: 'No se puede modificar una encomienda ya entregada' });
    }

    next();
  } catch (error) {
    console.error('Error en middleware de validación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
