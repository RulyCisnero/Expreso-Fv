"use client"

import './App.css';
import '../src/styles/global.css';
import { useState, useEffect } from 'react';
import { DashboardHeader } from './components/dashboard-header';
import { EncomiendaTable } from './components/EncomiendaTable';
import { EncomiendaDetail } from './components/encomienda-detail';
import { EncomiendaForm } from './components/encomienda-form';
import { ConfirmDelete } from '../src/components/confirm-delete'
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { deleteEncomienda } from './services/api';
import { IEncomienda, IEncomiendaVista } from './interface';


function App() {
  const [encomiendas, setEncomiendas] = useState<IEncomiendaVista[]>([]);
  const [selectedEncomienda, setSelectedEncomienda] = useState<IEncomiendaVista | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formOpen, setFormOpen] = useState(false)


  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [editMode, setEditMode] = useState(false)

  const { toast } = useToast()
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEncomiendas()
  }, [])

  const loadEncomiendas = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5100/api/encomiendas")
      if (!res.ok) throw new Error("No se pudieron cargar las encomiendas")
      const data = await res.json()
      setEncomiendas(data)
    } catch (error) {
      let errorMessage = "Error al cargar las encomiendas";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleViewEncomienda = (encomienda: IEncomiendaVista) => {
    setSelectedEncomienda(encomienda);
    setDetailOpen(true)
  }

  const handleAddEncomienda = () => {
    setSelectedEncomienda(null)
    setEditMode(false)
    setFormOpen(true)
  }

  // Para abrir el formulario de edición
  const handleEditEncomienda = (encomienda: IEncomiendaVista) => {
    setSelectedEncomienda(encomienda);
    setEditMode(true);
    setFormOpen(true);
  };

  /* const handleSaveEncomienda = async (encomiendaData: IEncomienda) => {
    try {
      const isEditing = !!selectedEncomienda;
      const url = isEditing
        ? `http://localhost:5100/api/encomiendas/${selectedEncomienda.id}`
        : "http://localhost:5100/api/encomiendas";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encomiendaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar la solicitud");
      }

      const result: IEncomiendaVista = await response.json();

      if (isEditing) {
        setEncomiendas(encomiendas.map(e => e.id === result.id ? result : e));
        toast({
          title: "Encomienda actualizada",
          description: `La encomienda #${result.id} ha sido actualizada correctamente.`,
        });
      } else {
        setEncomiendas([...encomiendas, result]);
        toast({
          title: "Encomienda creada",
          description: `La encomienda #${result.id} ha sido creada correctamente.`,
        });
      }

      setFormOpen(false);
      setSelectedEncomienda(null);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error desconocido al procesar la solicitud",
        variant: "destructive",
      });
    }
  }; */

  function formatearEncomiendaParaPUT(encomienda: IEncomienda): Record<string, any> {
    const data: Record<string, any> = {
      estado: encomienda.estado,
      descripcion: encomienda.descripcion,
      direccion_destino: encomienda.direccion_destino,
      chofer_id: encomienda.chofer_id,
    };

    if (encomienda.estado === "Pendiente") {
      // Agregamos solo si está pendiente
      data.cliente_id = encomienda.cliente_id;

      // el backend espera origen y destino, no origen_id/destino_id
      if (encomienda.origen_id) data.origen = encomienda.origen_id;
      if (encomienda.destino_id) data.destino = encomienda.destino_id;
    }

    return data;
  }

  const handleSaveEncomienda = async (encomiendaData: IEncomienda) => {
    try {
      if (editMode && selectedEncomienda) {
        // PUT para actualizar
        //console.log('selected encomienda: ', selectedEncomienda);
        //console.log(encomiendaData);
        const actualizarDatos = formatearEncomiendaParaPUT(encomiendaData);   
        const res = await fetch(`http://localhost:5100/api/encomiendas/${selectedEncomienda.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(actualizarDatos),
        })
        if (!res.ok) throw new Error("Error al actualizar la encomienda")
        const updated = await res.json()

        setEncomiendas(encomiendas.map((e) => (e.id === updated.id ? updated : e)))
        toast({
          title: "Encomienda actualizada",
          description: `La encomienda ${updated.codigo} ha sido actualizada correctamente.`,
        })
        console.log('DATOS ACTUALIZADOS???')
        console.log('selected encomienda: ', selectedEncomienda);
        console.log(actualizarDatos);
      } else {
        // POST para crear
        const res = await fetch("http://localhost:5100/api/encomiendas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encomiendaData),
        })
        if (!res.ok) throw new Error("Error al crear la encomienda")
        const created = await res.json()

        setEncomiendas([...encomiendas, created])
        toast({
          title: "Encomienda creada",
          description: `La encomienda ${created.codigo} ha sido creada correctamente.`,
        })
      }
      setFormOpen(false)
    } catch (error) {
      let errorMessage = "Error al cargar las encomiendas";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedEncomienda) return
    try {
      const success = await deleteEncomienda(selectedEncomienda.id)
      if (success) {
        setEncomiendas(encomiendas.filter((e) => e.id !== selectedEncomienda.id))
        toast({
          title: "Encomienda eliminada",
          description: `La encomienda ${selectedEncomienda.id} ha sido eliminada correctamente.`,
        })
      }
      setDeleteOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la encomienda",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEncomienda = (encomienda: IEncomiendaVista) => {
    setSelectedEncomienda(encomienda)
    setDeleteOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Seguimiento de Encomiendas</h1>
          <Button onClick={handleAddEncomienda}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Encomienda
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <EncomiendaTable
            encomiendas={encomiendas}
            onView={handleViewEncomienda}
            onEdit={handleEditEncomienda}
            onDelete={handleDeleteEncomienda}
          //onAsignarChofer={handleAsignarChofer}
          />
        )}
      </main>

      {/* Modales */}
      <EncomiendaDetail
        encomienda={selectedEncomienda}
        open={detailOpen}
        onClose={() => setDetailOpen(false)} />

      <EncomiendaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveEncomienda}
        encomienda={editMode ? selectedEncomienda || undefined : undefined}
      />

      {/* <AsignarChofer
        open={choferOpen}
        onClose={() => setChoferOpen(false)}
        onAsignar={handleConfirmAsignarChofer}
        encomienda={selectedEncomienda}
      />*/}

      <ConfirmDelete
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        encomienda={selectedEncomienda}
      />
    </div>
  )
}

export default App
