import React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label} from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// @ts-check
/// <reference path="../types.js" />

/**
 * @typedef {Object} EncomiendaFormProps
 * @property {boolean} open
 * @property {() => void} onClose
 * @property {(encomienda: Encomienda) => void} onSave
 * @property {Encomienda} [encomienda]
 */

/**
 * @param {EncomiendaFormProps} props
 */

export function EncomiendaForm({ open, onClose, onSave, encomienda }) {
    const [formData, setFormData] = useState({
        id: "",
        tipo: "",
        origen: "",
        destino: "",
        direccion_destino: "",
        estado: "pendiente",
        fechaCreacion: "", // Fecha actual en formato YYYY-MM-DD
        descripcion: "",
        clienteId: "",
        choferId: "",
    })
        useEffect(() => {
            if (encomienda) {
                setFormData({
                    id: encomienda.id,
                    tipo: encomienda.tipo,
                    origen: encomienda.origen,
                    destino: encomienda.destino,
                    direccion_destino: encomienda.direccion_destino,
                    estado: encomienda.estado,
                    fechaCreacion: encomienda.fechaCreacion,
                    descripcion: encomienda.descripcion,
                    clienteId: encomienda.clienteId,
                    choferId: encomienda.choferId,
                })
            } else {
                setFormData({
                    id: "",
                    tipo: "",
                    origen: "",
                    destino: "",
                    direccion_destino: "",
                    estado: "pendiente",
                    fechaCreacion: "", // Fecha actual en formato YYYY-MM-DD
                    descripcion: "",
                    clienteId: "",
                    choferId: "",
                })
            }
        }, [encomienda, open]) 

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "peso" || name === "precio" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name,value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{encomienda ? "Editar Encomienda" : "Nueva Encomienda"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigo">Código</Label>
                                <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="en_transito">En tránsito</SelectItem>
                                        <SelectItem value="entregado">Entregado</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="remitente">Remitente</Label>
                                <Input id="remitente" name="remitente" value={formData.remitente} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destinatario">Destinatario</Label>
                                <Input
                                    id="destinatario"
                                    name="destinatario"
                                    value={formData.destinatario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccionOrigen">Dirección de origen</Label>
                            <Input
                                id="direccionOrigen"
                                name="direccionOrigen"
                                value={formData.direccionOrigen}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccionDestino">Dirección de destino</Label>
                            <Input
                                id="direccionDestino"
                                name="direccionDestino"
                                value={formData.direccionDestino}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="peso">Peso (kg)</Label>
                                <Input
                                    id="peso"
                                    name="peso"
                                    type="number"
                                    step="0.1"
                                    value={formData.peso}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prioridad">Prioridad</Label>
                                <Select value={formData.prioridad} onValueChange={(value) => handleSelectChange("prioridad", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baja">Baja</SelectItem>
                                        <SelectItem value="media">Media</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="precio">Precio ($)</Label>
                                <Input
                                    id="precio"
                                    name="precio"
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">{encomienda ? "Actualizar" : "Crear"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
