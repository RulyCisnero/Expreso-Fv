/**
 * @typedef {Object} Chofer
 * @property {number} id
 * @property {string} nombre
 * @property {string} destinos
 */

/**
 * @typedef {"Pendiente" | "En tránsito" | "Listo para reparto" | "Entregada"} EstadoEncomienda
 * @typedef {"SALIENTE" | "ENTRANTE"} TipoEncomienda
 */

/**
 * @typedef {Object} Encomienda
 * @property {number} id
 * @property {TipoEncomienda} tipo
 * @property {string} origen
 * @property {string} destino
 * @property {string} direccion_destino
 * @property {EstadoEncomienda} estado
 * @property {string} fechaCreacion
 * @property {string} descripcion
 * @property {string} clienteId
 * @property {string} choferId
 */

/**
 * @typedef {Object} Cliente
 * @property {number} id 
 * @property {string} nombre 
 * @property {string} apellido
 * @property {string} direccion_local
 * @property {string} telefono
 * @property {string} email 
 */


/**
 * @typedef {Object} EncomiendaTableStates
 * @property {Encomienda[]} encomienda
 * @property {(encomienda: Encomienda) => void} onView
 * @property {(encomienda: Encomienda) => void} onEdit
 * @property {(encomienda: Encomienda) => void} onDelete
 * @property {(encomienda: Encomienda) => void} onAsignarChofer
 */

// Exportamos las definiciones para JSDoc (esto es solo documentación)
export const EncomiendaTypes = {
  // Este objeto está vacío, solo sirve para que JSDoc reconozca las definiciones
}