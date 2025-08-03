
export interface ICliente{
    id: number,
    nombre: string,
    apellido: string,
    direccion_local: string,
    telefono: string,
    email: string,
    id_localidad: number,
}

export interface IClienteVista{
    id: number,
    nombre: string,
    apellido: string,
    direccion_local: string,
    telefono: string,
    email: string,
    localidad: string,
}