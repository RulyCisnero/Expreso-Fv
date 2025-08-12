"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IEncomienda, IChofer, ILocalidad, IEncomiendaVista, ICliente } from "../interface";
import { EncomiendaDetail } from "./encomienda-detail"

interface EncomiendaFormProps {
    open: boolean
    onClose: () => void
    onSave: (encomienda: IEncomienda) => void
    onShow: (encomienda: IEncomienda) => void
    encomienda?: IEncomiendaVista  // Cambiamos a IEncomiendaVista para edición
}

export function EncomiendaForm({ open, onClose, onSave, encomienda, onShow }: EncomiendaFormProps) {
    const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [choferes, setChoferes] = useState<IChofer[]>([]);

    // Cargar datos en un solo useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locRes, cliRes, chofRes] = await Promise.all([
                    fetch("http://localhost:5100/api/localidades"),
                    fetch("http://localhost:5100/api/clientes"),
                    fetch("http://localhost:5100/api/choferes")
                ]);

                const [locData, cliData, chofData] = await Promise.all([
                    locRes.json(),
                    cliRes.json(),
                    chofRes.json()
                ]);

                setLocalidades(locData);
                setClientes(cliData);
                setChoferes(chofData);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };

        if (open) fetchData();
    }, [open]);

    const [formData, setFormData] = useState<IEncomienda>({
        id: 0,
        tipo: "Saliente",
        estado: "Pendiente",
        direccion_destino: '',
        fecha_creacion: new Date(),
        descripcion: '',
        precio: 0,
        cliente_id: 0,
        chofer_id: 0,
        origen_id: 0,
        destino_id: 0,
    });

    useEffect(() => {
        if (encomienda) {
            // Extraer solo los IDs necesarios de los objetos completos
            setFormData({
                id: encomienda.id,
                tipo: encomienda.tipo,
                estado: encomienda.estado,
                direccion_destino: encomienda.direccion_destino,
                fecha_creacion: encomienda.fecha_creacion,
                descripcion: encomienda.descripcion,
                precio: encomienda.precio,
                cliente_id: encomienda.cliente.id,
                chofer_id: encomienda.chofer?.id || 0,
                origen_id: encomienda.origen.id,
                destino_id: encomienda.destino.id
            });
        } else {
            setFormData({
                id: 0,
                tipo: "Saliente",
                estado: "Pendiente",
                direccion_destino: "",
                fecha_creacion: new Date(),
                descripcion: "",
                precio: 0,
                cliente_id: 0,
                chofer_id: 0,
                origen_id: 0,
                destino_id: 0,
            });
        }
    }, [encomienda, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "precio" ? Number.parseFloat(value) : value
        }));
    };

    const handleSelectChange = (name: keyof IEncomienda, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData); // Pasamos solo los datos de IEncomienda
        onClose();
    };

    const handleShow = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        onShow(formData);
        //onclose();
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
                                <Label>Destino</Label>
                                <Select
                                    value={String(formData.destino_id)}
                                    onValueChange={value => handleSelectChange("destino_id", parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {localidades.map(loc => (
                                            <SelectItem key={loc.id} value={String(loc.id)}>
                                                {loc.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Chofer</Label>
                                <Select
                                    value={String(formData.chofer_id)}
                                    onValueChange={value => handleSelectChange("chofer_id", parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar chofer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {choferes.map(chofer => (
                                            <SelectItem key={chofer.id} value={String(chofer.id)}>
                                                {chofer.nombre} {chofer.apellido}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={value => handleSelectChange("tipo", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SALIENTE">Saliente</SelectItem>
                                        <SelectItem value="ENTRANTE">Entrante</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select
                                    value={formData.estado}
                                    onValueChange={value => handleSelectChange("estado", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                        <SelectItem value="Entregada">Entregada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cliente</Label>
                                <Select
                                    value={String(formData.cliente_id)}
                                    onValueChange={value => handleSelectChange("cliente_id", parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clientes.map(cliente => (
                                            <SelectItem key={cliente.id} value={String(cliente.id)}>
                                                {cliente.nombre} {cliente.apellido}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Origen</Label>
                                <Select
                                    value={String(formData.origen_id)}
                                    onValueChange={value => handleSelectChange("origen_id", parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {localidades.map(loc => (
                                            <SelectItem key={loc.id} value={String(loc.id)}>
                                                {loc.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccion_destino">Dirección de destino</Label>
                            <Input
                                id="direccion_destino"
                                name="direccion_destino"
                                value={formData.direccion_destino}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="precio">Precio ($)</Label>
                            <Input
                                id="precio"
                                name="precio"
                                type="number"
                                //step="100"
                                value={formData.precio}
                                onChange={handleChange}
                                required
                            />
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
                    {/* ajustar boton previsualizar para que se vea del lado izquierdo */}
                    <DialogFooter>
                        <div className="h-9 rounded-md px-3">
                            <Button type="button"> Previsualizar</Button>
                        </div>
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