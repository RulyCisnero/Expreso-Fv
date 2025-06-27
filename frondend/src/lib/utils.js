export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatearFecha(fechaString){
  const fecha = new Date(fechaString)
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha)
}
