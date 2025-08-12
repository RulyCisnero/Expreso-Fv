
export const deleteEncomienda = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:5100/encomiendas/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Error al eliminar encomienda: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error('Error en deleteEncomienda:', error)
    return false
  }
}
