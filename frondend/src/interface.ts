export interface Chofer {
  id: string
  nombre: string
  apellido: string
  telefono: string
  licencia: string
  disponible: boolean
}

export interface Cliente{
  id: string
  nombre: string
  apellido: string
  dir_local: string
  telefono: string
  email: string
}

export interface Encomienda {
  id: string
  origen: string
  destino: string
  direccion_destino: string
  estado: "pendiente" | "en_transito" | "entregado" | "cancelado"
  fecha_creacion: string
  descripcion: string
  cliente: Cliente
  chofer: Chofer | null
}
