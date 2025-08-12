import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatearFecha } from "@/lib/utils"
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react"
//import type { Encomienda } from "@/types"
import { IEncomienda,IEncomiendaVista } from "../interface";

interface EncomiendaDetailProps {
  encomienda: IEncomiendaVista | null
  open: boolean
  onClose: () => void
}

export function EncomiendaDetail({ encomienda, open, onClose }:EncomiendaDetailProps) {
    if (!encomienda) return null
    const getEstadoIcon = (estado: IEncomiendaVista["estado"]) => {
        switch (estado) {
            case "Pendiente":
                return <Clock className="h-4 w-4 text-yellow-500" />
            case "Entregada":
                return <CheckCircle className="h-4 w-4 text-green-500" />
        }
    }

    const getEstadoText = (estado: IEncomiendaVista["estado"]) => {
        switch (estado) {
            case "Pendiente":
                return "Pendiente"
            case "En tránsito":
                return "En tránsito"
            case "Entregada":
                return "Entregada"
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detalles de Encomienda - ID {encomienda.id}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-lg font-medium">
                            {getEstadoIcon(encomienda.estado)}
                            <span>{getEstadoText(encomienda.estado)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Cliente</h3>
                            <p className="mt-1">{encomienda.cliente.nombre}, {encomienda.cliente.apellido}</p>
                        </div>
                       {/*  <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Destinatario</h3>
                            <p className="mt-1">{encomienda.direccion_destino} - {encomienda.destino_id}</p>
                        </div> */}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Dirección de origen</h3>
                            <p className="mt-1">{encomienda.cliente.direccion_local}, {encomienda.origen_id}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Dirección de destino</h3>
                            <p className="mt-1">{encomienda.direccion_destino}, {encomienda.destino_id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Fecha de creación</h3>
                            <p className="mt-1">{formatearFecha(encomienda.fecha_creacion)}</p>
                        </div>
                        {/* <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Fecha de entrega</h3>
                            <p className="mt-1">{encomienda.fecha_creacion ? formatearFecha(encomienda.fecha_creacion) : "Pendiente"}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Peso</h3>
                            <p className="mt-1">{ } kg</p>
                        </div> */}
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Descripción</h3>
                        <p className="mt-1">{encomienda.descripcion}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Chofer asignado</h3>
                            <p className="mt-1">
                                {encomienda.chofer
                                    ? `${encomienda.chofer.nombre}, ${encomienda.chofer.apellido}`
                                    : "Sin asignar"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Precio</h3>
                            <p className="mt-1 font-medium">${encomienda.precio} </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
