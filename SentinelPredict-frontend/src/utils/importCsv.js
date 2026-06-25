function parseCsvLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function parseReportsCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("El archivo CSV no contiene datos suficientes.");
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());

  const requiredHeaders = ["title", "description"];
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Falta la columna requerida: ${header}`);
    }
  }

  const reports = lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, i) => {
      row[header] = values[i] ?? "";
    });

    if (!row.title || !row.description) {
      throw new Error(
        `La fila ${index + 2} no contiene title o description válidos.`
      );
    }

    return {
      title: row.title,
      description: row.description,
      source: row.source || "manual",
      area: row.area || null,
      incident_date: row.incident_date || null,
    };
  });

  return reports;
}