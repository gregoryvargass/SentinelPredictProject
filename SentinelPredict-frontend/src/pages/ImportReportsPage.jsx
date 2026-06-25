import { useRef, useState } from "react";
import { createManyReports } from "../services/api";
import { parseReportsCsv } from "../utils/importCsv";
import EmptyState from "../components/EmptyState";

export default function ImportReportsPage({
  onReportsImported,
  onActionError,
}) {
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [parsedReports, setParsedReports] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  async function processFile(file) {
    setError("");
    setParsedReports([]);
    setFileName("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      const message = "Solo se permiten archivos CSV.";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
      return;
    }

    try {
      const text = await file.text();
      const reports = parseReportsCsv(text);
      setParsedReports(reports);
      setFileName(file.name);
    } catch (err) {
      const message = err.message || "No se pudo leer el archivo CSV.";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    await processFile(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragActive(false);
  }

  async function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    await processFile(file);
  }

  async function handleImport() {
    try {
      setSubmitting(true);
      setError("");

      const createdReports = await createManyReports(parsedReports);

      if (onReportsImported) {
        onReportsImported(createdReports);
      }

      setParsedReports([]);
      setFileName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message = err.message || "No se pudieron importar los reportes.";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClearFile() {
    setParsedReports([]);
    setFileName("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Importación masiva
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Importar reportes desde archivo CSV
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Sube un archivo CSV para registrar múltiples incidentes en lote,
              previsualizar los datos detectados y confirmar la importación
              antes de guardarlos en SentinelPredict.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-sm text-slate-400">Formato esperado</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Columnas mínimas requeridas:{" "}
              <span className="font-semibold text-white">title</span> y{" "}
              <span className="font-semibold text-white">description</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-400">Carga de archivo</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Selecciona o arrastra tu CSV
            </h3>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-white bg-slate-950"
                : "border-slate-700 bg-slate-950/70 hover:border-slate-500"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl">
              ⤴
            </div>

            <h4 className="mt-4 text-lg font-semibold text-white">
              Arrastra tu archivo aquí
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              O haz clic para buscar un archivo CSV en tu dispositivo.
            </p>

            <button
              type="button"
              className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Seleccionar archivo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {fileName && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Archivo cargado</p>
                <p className="mt-1 font-medium text-white">{fileName}</p>
              </div>

              <button
                type="button"
                onClick={handleClearFile}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Quitar archivo
              </button>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-400">Guía rápida</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Estructura del archivo
            </h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-medium text-white">
                Columnas recomendadas
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                <span className="font-semibold text-slate-200">title</span>,{" "}
                <span className="font-semibold text-slate-200">
                  description
                </span>
                ,{" "}
                <span className="font-semibold text-slate-200">source</span>,{" "}
                <span className="font-semibold text-slate-200">area</span>,{" "}
                <span className="font-semibold text-slate-200">
                  incident_date
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-medium text-white">Ejemplo</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3 text-xs leading-6 text-slate-300">
{`title,description,source,area,incident_date
Resbalón en zona de carga,Un operario resbaló por presencia de líquido,manual,Logística,2026-04-12T10:30:00`}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-medium text-white">
                Recomendación operativa
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Verifica que el archivo no tenga filas vacías, encabezados mal
                escritos o fechas con formatos inconsistentes antes de importar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {parsedReports.length > 0 ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
              <p className="text-sm text-slate-400">Reportes detectados</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {parsedReports.length}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Registros listos para ser importados.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
              <p className="text-sm text-slate-400">Origen</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Archivo CSV
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Previsualización previa al registro masivo.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
              <p className="text-sm text-slate-400">Acción disponible</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Importación en lote
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Guarda todos los registros válidos en el sistema.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Vista previa</p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Reportes listos para importar
                </h3>
              </div>

              <button
                onClick={handleImport}
                disabled={submitting}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Importando..." : "Importar reportes"}
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-sm">
                  <thead className="bg-slate-900/95">
                    <tr>
                      <th className="px-4 py-4 text-left font-medium text-slate-300">
                        Título
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-slate-300">
                        Área
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-slate-300">
                        Fuente
                      </th>
                      <th className="px-4 py-4 text-left font-medium text-slate-300">
                        Fecha
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {parsedReports.map((report, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-slate-900/60"
                      >
                        <td className="px-4 py-4 align-top">
                          <p className="font-medium text-white">{report.title}</p>
                          <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-slate-500">
                            {report.description}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top text-slate-300">
                          {report.area || "N/A"}
                        </td>

                        <td className="px-4 py-4 align-top text-slate-300">
                          {report.source || "manual"}
                        </td>

                        <td className="px-4 py-4 align-top text-slate-300">
                          {report.incident_date || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <EmptyState
            title="Todavía no hay un archivo cargado"
            description="Sube un archivo CSV válido para visualizar los registros detectados antes de importarlos al sistema."
          />
        </section>
      )}
    </div>
  );
}