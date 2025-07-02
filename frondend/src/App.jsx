import './App.css';
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './components/dashboard-header';
import { EncomiendaTable } from './components/EncomiendaTable';
import { EncomiendaDetail } from './components/encomienda-detail';
import { EncomiendaForm } from './components/encomienda-form';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import "../src/types.js";

function App() {
  const [encomiendas, setEncomiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEncomienda, setSelectedEncomienda] = useState(null);


  const [detailOpen, setDetailOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  

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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleViewEncomienda = (encomienda) => {
    setSelectedEncomienda(encomienda)
    setDetailOpen(true)
  }

  const handleAddEncomienda = () => {
    setSelectedEncomienda(null)
    setEditMode(false)
    setFormOpen(true)
  }

  const handleSaveEncomienda = async (encomiendaData) => {
  try {
    if (editMode && selectedEncomienda) {
      // PUT para actualizar
      const res = await fetch(`http://localhost:5100/api/encomiendas/${selectedEncomienda.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encomiendaData),
      })
      if (!res.ok) throw new Error("Error al actualizar la encomienda")
      const updated = await res.json()

      setEncomiendas(encomiendas.map((e) => (e.id === updated.id ? updated : e)))
      toast({
        title: "Encomienda actualizada",
        description: `La encomienda ${updated.codigo} ha sido actualizada correctamente.`,
      })
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
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }
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
            //onEdit={handleEditEncomienda}
            //onDelete={handleDeleteEncomienda}
            //onAsignarChofer={handleAsignarChofer}
          />
        )}
		</main>

      {/* Modales */}
      <EncomiendaDetail encomienda={selectedEncomienda} open={detailOpen} onClose={() => setDetailOpen(false)} />

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
      />

      <ConfirmDelete
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        encomienda={selectedEncomienda}
      /> */}
    </div>
  )
}

export default App
