import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck, XCircle, User, Trash2  } from "lucide-react"
import { Button } from "@/components/ui/button"; // Asegurate que apunta bien a tu archivo
import { Edit } from "lucide-react"; // Asegurate que apunta bien a tu archivo
import "../types";
import  {formatearFecha}  from "../lib/utils";
// @ts-check
/// <reference path="../types.js" />


import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"; // Asegurate que apunta bien a tu archivo

/**
 * @typedef {Object} EncomiendaTableStates
 * @property {Encomienda[]} encomienda
 * @property {(encomienda: Encomienda) => void} onView
 * @property {(encomienda: Encomienda) => void} onEdit
 * @property {(encomienda: Encomienda) => void} onDelete
 * @property {(encomienda: Encomienda) => void} onAsignarChofer
 */

/**
 * @param {EncomiendaTableStates} props
 */


export function EncomiendaTable({ onView, onEdit, onDelete, onAsignarChofer }) {
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

  function iconoEstado(estado) {
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
      case "En tránsito":
        return "En tránsito"
      case "Entregada":
        return "Entregada"
      case "Cancelado":
        return "Cancelado"
    }
  } 


  return (
    <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Dir Destino</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Chofer</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encomiendas.map((encomienda) => (
            <TableRow key={encomienda.id}
              className="cursor-pointer hover:bg-muted/50 "
              onClick={() => {
                onView(encomienda);
                console.log("se hizo click en la encomienda", encomienda.direccion_destino);
              }}
            >
              <TableCell className="font-medium"><strong>{encomienda.cliente.nombre}</strong></TableCell>
              <TableCell>{encomienda.origen}</TableCell>
              <TableCell>{encomienda.destino}</TableCell>
              <TableCell>{encomienda.direccion_destino}</TableCell>
              <TableCell>{/* encomienda.estado */}
                <div className="flex items-center p-2 gap-2">
                  {iconoEstado(encomienda.estado)}
                  <span>
                    {getEstadoText(encomienda.estado)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatearFecha(encomienda.fecha_creacion)}</TableCell>
              <TableCell>{encomienda.chofer.nombre}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(encomienda)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                   <Button variant="ghost" size="icon" onClick={() => onAsignarChofer(encomienda)}>
                    <User className="h-4 w-4" />
                    <span className="sr-only">Asignar chofer</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(encomienda)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>  
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


