type Estado = "Pendiente" | "Entregada";
type Tipo = "Entrante" | "Saliente";

export interface ILocalidad {
    id: number;
    nombre: string;
}

export interface IChofer {
    id:number;
    nombre: string;
    apellido: string;
    destino_id: number; // Solo el ID de la localidad
}

export interface IChoferVista {
    id: number;
    nombre: string;
    apellido: string;
    localidad:  ILocalidad ;
}

export interface ICliente {
    id: number;
    nombre: string;
    apellido: string;
    direccion_local: string;
    telefono: string;
    email: string;
    localidad: string;
}

export interface IClienteVista {
    id: number;
    nombre: string;
    apellido: string;
    direccion_local: string;
    telefono: string;
    email: string;
    localidad: ILocalidad;
}

export interface IEncomienda {
    id?: number;
    tipo: Tipo;
    estado: Estado;
    direccion_destino: string;
    fecha_creacion: Date;
    descripcion: string;
    precio?: number;
    cliente_id: number;  // Solo ID
    chofer_id: number;   // Solo ID
    origen_id: number;   // Solo ID
    destino_id: number;  // Solo ID
}

export interface IEncomiendaVista {
    id: number;
    tipo: Tipo;
    estado: Estado;
    direccion_destino: string;
    fecha_creacion: Date; // Ahora es Date
    descripcion: string;
    precio: number; // Ahora es número
    origen: ILocalidad;
    destino: ILocalidad;
    cliente: IClienteVista;
    chofer: IChoferVista | null; // Puede ser null
}




/* 
type Estado = "Pendiente" | "Entregada";
type Tipo = "Entrante" | "Saliente";

export interface Ilocalidad{
  id:number;
  nombre:string;
}

export interface IChofer {
  id: number;
  nombre: string;
  apellido: string;
  id_localidad: Ilocalidad;
}

export interface ICliente{
    id: number;
    nombre: string;
    apellido: string;
    direccion_local: string;
    telefono: string;
    email: string;
    id_localidad: Ilocalidad;
}

export interface IClienteVista{
    id: number;
    nombre: string;
    apellido: string;
    direccion_local: string;
    telefono: string;
    email: string;
    localidad: string;
}

  export interface IEncomienda {
    id?: number;
    tipo: Tipo;
    estado: Estado;
    direccion_destino: string;
    fecha_creacion: Date;
    descripcion: string;
    precio?: number;
    cliente_id: number;
    chofer_id: number;
    origen_id: number;
    destino_id: number;
  }

  export interface IEncomiendaVista {
    id?: number;
    tipo: string;
    estado: string;
    direccion_destino: string;
    fecha_creacion: Date;
    descripcion: string;
    precio?: number;
    cliente_id: number;
    chofer_id: number;
    origen_id: number;
    destino_id: number;
    cliente: {
      nombre: string;
      apellido: string;
      telefono: string;
      direccion_local: string;
      id_localidad: string; 
    }
    chofer: {
      nombre: string | null;
      apellido: string | null;
      destino_id: number | null;
    } | null;
  }
 */