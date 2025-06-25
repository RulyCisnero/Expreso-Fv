import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"; // Asegurate que apunta bien a tu archivo
import { Edit } from "lucide-react"; // Asegurate que apunta bien a tu archivo
import "../types";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"; // Asegurate que apunta bien a tu archivo

/*  
export function EncomiendaTableStates() {
  // ya tenés autocompletado en VS Code sobre `props` y `encomiendas`
}
 */

 /**
 * @param {EncomiendaTableProps} props
 */
function EncomiendaTable({ encomienda, onView, onEdit, onDelete, onAsignarChofer }) {
  const [encomiendas, setEncomiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: cuando el componente se monta, llamamos a la API
  useEffect(() => {
    fetch("http://localhost:5100/api/encomiendas") // Cambia el puerto si usás otro
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar las encomiendas");
        }
        return res.json();
      })
      .then((data) => {
        setEncomiendas(data); // guardamos las encomiendas en estado
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // [] significa: ejecutarlo solo una vez, al cargar

  if (loading) return <p className="p-4">Cargando encomiendas...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  function iconoEstado(estado){
    switch (estado) {
      case "Pendiente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "En tránsito":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "Entregada":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Cancelado":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getEstadoText = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "Pendiente"
      case "en_transito":
        return "En tránsito"
      case "Entregada":
        return "Entregada"
      case "Cancelado":
        return "Cancelado"
    }
  }
 

  return (
    <div className="p-6 rounded-md border ">
      <h2 className="text-xl font-bold mb-4">Seguimiento de encomiendas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Dir Destino</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Chofer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encomiendas.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.cliente.nombre}</TableCell>
              <TableCell>{e.origen}</TableCell>
              <TableCell>{e.destino}</TableCell>
              <TableCell>{e.direccion_destino}</TableCell>
              <TableCell>{e.estado}
                 <div className="flex items-center gap-2">
                  {iconoEstado(e.estado)}
                  {/* <span>{getEstadoText(e.estado)}</span> */}
                </div>
              </TableCell>
              <TableCell>{e.chofer.nombre}</TableCell>
            </TableRow>
          ))}
          <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(encomienda)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </div>
              </TableCell>
        </TableBody>
      </Table>
    </div>
  );
}

export default EncomiendaTable;
