/**
 * @typedef {Object} Chofer
 * @property {string} nombre
 * @property {string} apellido
 */

/**
 * @typedef {"pendiente" | "en_transito" | "entregado" | "cancelado"} EstadoEncomienda
 * @typedef {"baja" | "media" | "alta"} PrioridadEncomienda
 */

/**
 * @typedef {Object} Encomienda
 * @property {string} id
 * @property {string} codigo
 * @property {string} remitente
 * @property {string} destinatario
 * @property {EstadoEncomienda} estado
 * @property {PrioridadEncomienda} prioridad
 * @property {string} fechaCreacion
 * @property {Chofer|null} chofer
 */

/**
 * @typedef {Object} EncomiendaTableProps
 * @property {Encomienda[]} encomiendas
 * @property {(encomienda: Encomienda) => void} onView
 * @property {(encomienda: Encomienda) => void} onEdit
 * @property {(encomienda: Encomienda) => void} onDelete
 * @property {(encomienda: Encomienda) => void} onAsignarChofer
 */
