function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

export function exportReportsToCsv(reports, filename = "reportes.csv") {
  const headers = [
    "ID",
    "Título",
    "Descripción",
    "Área",
    "Clasificación",
    "Fecha del incidente",
    "Estado",
    "Fuente",
  ];

  const rows = reports.map((report) => [
    report.id,
    report.title,
    report.description,
    report.area || "",
    report.classification_label || "",
    report.incident_date
      ? new Date(report.incident_date).toLocaleString()
      : "",
    report.status,
    report.source || "",
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}