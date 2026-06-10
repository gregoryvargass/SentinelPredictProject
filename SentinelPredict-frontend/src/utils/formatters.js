export function formatStatusLabel(status) {
  if (status === "processed") return "Procesado";
  if (status === "pending") return "Pendiente";
  if (status === "failed") return "Fallido";
  return status;
}

export function getStatusBadgeClass(status) {
  if (status === "processed") {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  }

  if (status === "pending") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
  }

  if (status === "failed") {
    return "bg-red-500/15 text-red-300 border border-red-500/20";
  }

  return "bg-slate-800 text-slate-200 border border-slate-700";
}

export function getPriorityBadgeClass(priority) {
  if (priority === "alta") {
    return "bg-red-500/15 text-red-300 border border-red-500/20";
  }

  if (priority === "media") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
  }

  if (priority === "baja") {
    return "bg-sky-500/15 text-sky-300 border border-sky-500/20";
  }

  return "bg-slate-800 text-slate-200 border border-slate-700";
}

export function formatEntityLabel(label) {
  const map = {
    PERSONA: "Persona",
    AREA: "Área",
    EQUIPO: "Equipo",
    CONDICION: "Condición",
    SUSTANCIA: "Sustancia",
    EVENTO: "Evento",
  };

  return map[label] || label;
}

export function getRecommendationByClassification(label) {
  const map = {
    "Riesgo de caída":
      "Se recomienda reforzar limpieza de superficies, señalización preventiva y revisión de condiciones resbalosas.",
    "Riesgo químico":
      "Se recomienda revisar protocolos de manipulación de sustancias, uso de EPP y respuesta ante derrames.",
    "Riesgo mecánico":
      "Se recomienda inspeccionar maquinaria, resguardos de seguridad y procedimientos operativos.",
    "Riesgo eléctrico":
      "Se recomienda verificar cableado, equipos energizados y procedimientos de seguridad eléctrica.",
    "Riesgo ergonómico":
      "Se recomienda evaluar postura, levantamiento de carga y rediseño de tareas físicas.",
    "Riesgo general":
      "Se recomienda revisar el incidente manualmente para determinar medidas preventivas específicas.",
  };

  return map[label] || "No hay recomendación disponible para esta clasificación.";
}