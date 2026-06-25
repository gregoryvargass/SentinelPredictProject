const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getDashboardData(filters = {}) {
  const params = new URLSearchParams();

  if (filters.startDate) {
    params.append("start_date", filters.startDate);
  }

  if (filters.endDate) {
    params.append("end_date", filters.endDate);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_BASE_URL}/analytics/dashboard?${queryString}`
    : `${API_BASE_URL}/analytics/dashboard`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudo obtener la información del dashboard");
  }

  return response.json();
}

export async function getReports() {
  const response = await fetch(`${API_BASE_URL}/reports/`);

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de reportes");
  }

  return response.json();
}

export async function getReportFull(reportId) {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/full`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el detalle del reporte");
  }

  return response.json();
}

export async function processReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/process`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("No se pudo procesar el reporte");
  }

  return response.json();
}

export async function createReport(payload) {
  const response = await fetch(`${API_BASE_URL}/reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el reporte");
  }

  return response.json();
}

export async function createManyReports(reports) {
  const results = [];

  for (const report of reports) {
    const created = await createReport(report);
    results.push(created);
  }

  return results;
}

export async function updateReport(reportId, payload) {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el reporte");
  }

  return response.json();
}

export async function deleteReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el reporte");
  }

  return response.json();
}