import { ICliente } from "./cliente.ts";
import { IChofer } from "./chofer.ts";
import { Localidad } from "./localidad.ts";

  export interface IEncomienda {
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
  }

  export interface IEncomiendaVista {
    id?: number;
    tipo: string;
    estado: string;
    direccion_destino: string;
    fecha_creacion: Date;
    descripcion: string;
    precio?: number;
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
