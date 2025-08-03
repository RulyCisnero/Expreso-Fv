import pool from '../../database/connectionPostgreSQL.ts';
import { IEncomienda, IEncomiendaVista } from '../../interfaces/encomienda.ts'

class EncomiendaModel {
    async createEncomienda(encomiendaData: IEncomienda): Promise<IEncomienda> {
        const query =
            `
         INSERT INTO encomienda (
          tipo, estado, direccion_destino, descripcion, precio,
          cliente_id, chofer_id, origen_id, destino_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
         `;

        const values = [
            encomiendaData.tipo,
            encomiendaData.estado,
            encomiendaData.direccion_destino,
            encomiendaData.descripcion,
            encomiendaData.precio,
            encomiendaData.cliente_id,
            encomiendaData.chofer_id,
            encomiendaData.origen_id,
            encomiendaData.destino_id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    };

    async getEncomiendaById(id: number): Promise<IEncomiendaVista | null> {
        const query = `
        SELECT
            e.id AS encomienda_id,
            e.tipo,
            e.estado,
            e.direccion_destino,
            e.fecha_creacion,
            e.descripcion,
            e.precio,

            -- Datos del cliente
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.direccion_local AS cliente_direccion_local,
            c.telefono AS cliente_telefono,
            lc.nombre AS localidad_cliente,

            -- Datos del chofer
            ch.id AS chofer_id,
            ch.nombre AS chofer_nombre,
            ch.apellido AS chofer_apellido,
            ch.destino_id AS chofer_destino_id_localidad,

            -- Localidades de origen y destino
            lo.nombre AS localidad_origen,
            ld.nombre AS localidad_destino

        FROM encomienda e
        LEFT JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id
        WHERE e.id = $1
    `;

        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) return null;

        const row = result.rows[0];

        return {
            id: row.encomienda_id,
            tipo: row.tipo,
            estado: row.estado,
            direccion_destino: row.direccion_destino,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            precio: row.precio,
            origen_id: row.localidad_origen,
            destino_id: row.localidad_destino,
            cliente: {
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                direccion_local: row.cliente_direccion_local,
                telefono: row.cliente_telefono,
                id_localidad: row.localidad_cliente,
            },
            chofer: row.chofer_id ? {
                nombre: row.chofer_nombre,
                apellido: row.chofer_apellido,
                destino_id: row.chofer_destino_id,
            } : null
        };
    }


    async getAllEncomiendas(): Promise<IEncomiendaVista[]> {
        const query =
            `
         SELECT
            e.id AS encomienda_id,
            e.tipo,
            e.estado,
            e.direccion_destino,
            e.fecha_creacion,
            e.descripcion,
            e.precio,

            -- Datos del cliente
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.direccion_local AS cliente_direccion_local,
            c.telefono AS cliente_telefono,
            lc.nombre AS localidad_cliente,

            -- Datos del chofer
            ch.id AS chofer_id,
            ch.nombre AS chofer_nombre,
            ch.apellido AS chofer_apellido,
            ch.destino_id AS chofer_destino_id_localidad,

            -- Localidades de origen y destino
            lo.nombre AS localidad_origen,
            ld.nombre AS localidad_destino

        FROM encomienda e
        LEFT JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id
        ORDER BY e.id ASC;
         `;

        const result = await pool.query(query);

        // Transformar a JSON estructurado
        return result.rows.map(row => ({
            id: row.encomienda_id,
            tipo: row.tipo,
            estado: row.estado,
            direccion_destino: row.direccion_destino,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            precio: row.precio,
            origen_id: row.localidad_origen,
            destino_id: row.localidad_destino,
            cliente: {
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                direccion_local: row.cliente_direccion_local,
                telefono: row.cliente_telefono,
                id_localidad: row.localidad_cliente,
            },
            chofer: row.chofer_nombre
                ? {
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    destino_id: row.chofer_destino_id_localidad,
                }
                : null
        }));
    };

    // Filtrar encomiendas por estado, cliente_id y chofer_id
    async getFilteredEncomiendas({ estado, cliente_id, chofer_id }: { estado: string, cliente_id?: number, chofer_id?: number }): Promise<IEncomiendaVista[]> {
        let query = ` 
      SELECT 
        e.id,
        e.tipo,
        e.estado,
        e.direccion_destino,
        e.fecha_creacion,
        e.descripcion,
        e.precio,

        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.direccion_local AS cliente_direccion_local,
        c.telefono AS cliente_telefono,
        lc.nombre AS id_localidad,

        ch.nombre AS chofer_nombre,
        ch.apellido AS chofer_apellido,
        ch.destino_id AS chofer_destino_id_localidad,

        lo.nombre AS origen_localidad,
        ld.nombre AS destino_localidad

        FROM encomienda e
        JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id
        `;
        const conditions: string[] = [];
        const values: any = [];
        if (estado) {
            values.push(estado);
            conditions.push(`e.estado = $${values.length}`);
        }

        if (cliente_id) {
            values.push(cliente_id);
            conditions.push(`e.cliente_id = $${values.length}`);
        }

        if (chofer_id) {
            values.push(chofer_id);
            conditions.push(`e.chofer_id = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }
        query += ' ORDER BY e.id DESC';
        const result = await pool.query(query, values);

        return result.rows.map(row => ({
            id: row.id,
            tipo: row.tipo,
            estado: row.estado,
            direccion_destino: row.direccion_destino,
            fecha_creacion: row.fecha_creacion,
            descripcion: row.descripcion,
            precio: row.precio,
            origen_id: row.origen_localidad,
            destino_id: row.destino_localidad,
            cliente: {
                nombre: row.cliente_nombre,
                apellido: row.cliente_apellido,
                telefono: row.cliente_telefono,
                direccion_local: row.cliente_direccion_local,
                id_localidad: row.id_localidad,
            },
            chofer: row.chofer_nombre
                ? {
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    destino_id: row.chofer_destino_id_localidad,
                }
                : null,
        }));
    };

    async updateEncomienda(id: number, data: Partial<IEncomienda>): Promise<IEncomienda> {
        const camposSiemprePermitidos = [
            "estado",
            "descripcion",
            "direccion_destino",
            "chofer_id"
        ];

        const camposCondicionales = [
            "cliente_id",
            "origen",
            "destino"
        ];

        // Traemos la encomienda original
        const { rows } = await pool.query("SELECT * FROM encomienda WHERE id = $1", [id]);
        if (rows.length === 0) throw new Error("Encomienda no encontrada");

        const encomienda = rows[0];

        if (encomienda.estado === "Entregada") {
            throw new Error("No se puede modificar una encomienda entregada");
        }

        const camposFinales = [];
        const valores = [];
        let contador = 1;

        for (const [key, value] of Object.entries(data)) {
            if (camposSiemprePermitidos.includes(key)) {
                camposFinales.push(`${key} = $${contador}`);
                valores.push(value);
                contador++;
            } else if (camposCondicionales.includes(key)) {
                if (encomienda.estado === "Pendiente") {
                    camposFinales.push(`${key} = $${contador}`);
                    valores.push(value);
                    contador++;
                } else {
                    throw new Error(`El campo '${key}' solo puede modificarse si la encomienda está Pendiente`);
                }
            } else {
                throw new Error(`No está permitido actualizar el campo: '${key}'`);
            }
        }

        if (camposFinales.length === 0) {
            throw new Error("No se especificaron campos válidos para actualizar");
        }

        valores.push(id); // último valor para el WHERE
        const updateQuery = `
        UPDATE encomienda
        SET ${camposFinales.join(", ")}
        WHERE id = $${contador}
        RETURNING *
    `;

        const result = await pool.query(updateQuery, valores);
        return result.rows[0];
    }

    async existeEncomienda(id: number): Promise<boolean> {
        const result = await pool.query('SELECT 1 FROM encomienda WHERE id = $1', [id]);
         if (result.rowCount === 0) {
            return false; // No se encontró la encomienda para eliminar
        }
        return result.rows[0]; // Retorna la encomienda eliminada
    }

    async actualizarEstado(id: number, estado: string): Promise<void> {
        await pool.query(
            'UPDATE encomienda SET estado = $1 WHERE id = $2',
            [estado, id]
        );
    }


    async deleteEncomienda(id: number): Promise<IEncomienda | null> {
        const query = `
        DELETE FROM encomienda
        WHERE id = $1
        RETURNING *
        `;
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return null; // No se encontró la encomienda para eliminar
        }
        return result.rows[0]; // Retorna la encomienda eliminada
    };

};
export default new EncomiendaModel();