import { useEffect, useMemo, useState } from "react";
import { getReports } from "../services/api";
import { formatStatusLabel, getStatusBadgeClass } from "../utils/formatters";
import ReportsTableSkeleton from "../components/ReportsTableSkeleton";

export default function ReportsPage({
  onSelectReport,
  refreshKey,
  filters,
  onFiltersChange,
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchTerm = filters?.searchTerm ?? "";
  const statusFilter = filters?.statusFilter ?? "all";
  const areaFilter = filters?.areaFilter ?? "all";
  const classificationFilter = filters?.classificationFilter ?? "all";
  const startDateFilter = filters?.startDateFilter ?? "";
  const endDateFilter = filters?.endDateFilter ?? "";

  function updateFilter(name, value) {
    onFiltersChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err.message || "Ocurrió un error cargando los reportes");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [refreshKey]);

  const availableAreas = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(
        reports
          .map((report) => report.area)
          .filter((area) => area && area.trim() !== "")
      )
    );

    return uniqueAreas.sort((a, b) => a.localeCompare(b));
  }, [reports]);

  const availableClassifications = useMemo(() => {
    const uniqueClassifications = Array.from(
      new Set(
        reports
          .map((report) => report.classification_label)
          .filter((label) => label && label.trim() !== "")
      )
    );

    return uniqueClassifications.sort((a, b) => a.localeCompare(b));
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        search === "" ||
        report.title?.toLowerCase().includes(search) ||
        report.description?.toLowerCase().includes(search) ||
        report.area?.toLowerCase().includes(search) ||
        report.source?.toLowerCase().includes(search) ||
        report.classification_label?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : report.status === statusFilter;

      const matchesArea =
        areaFilter === "all" ? true : report.area === areaFilter;

      const matchesClassification =
        classificationFilter === "all"
          ? true
          : report.classification_label === classificationFilter;

      let matchesStartDate = true;
      let matchesEndDate = true;

      if (report.incident_date) {
        const reportDate = new Date(report.incident_date);
        const reportDay = new Date(
          reportDate.getFullYear(),
          reportDate.getMonth(),
          reportDate.getDate()
        );

        if (startDateFilter) {
          const start = new Date(startDateFilter);
          matchesStartDate = reportDay >= start;
        }

        if (endDateFilter) {
          const end = new Date(endDateFilter);
          matchesEndDate = reportDay <= end;
        }
      } else {
        if (startDateFilter || endDateFilter) {
          matchesStartDate = false;
          matchesEndDate = false;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesArea &&
        matchesClassification &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    reports,
    searchTerm,
    statusFilter,
    areaFilter,
    classificationFilter,
    startDateFilter,
    endDateFilter,
  ]);

  function clearFilters() {
    onFiltersChange({
      searchTerm: "",
      statusFilter: "all",
      areaFilter: "all",
      classificationFilter: "all",
      startDateFilter: "",
      endDateFilter: "",
    });
  }

  if (loading) {
    return <ReportsTableSkeleton />;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-semibold text-white">Reportes</h2>
        <p className="mt-2 text-slate-400">
          Consulta de reportes narrativos registrados en el sistema.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Resumen de resultados</p>
        <p className="mt-2 text-slate-200">
          Mostrando{" "}
          <span className="font-semibold text-white">
            {filteredReports.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-white">{reports.length}</span>{" "}
          reportes registrados.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => updateFilter("searchTerm", event.target.value)}
              placeholder="Título, descripción, área..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Filtrar por estado</label>
            <select
              value={statusFilter}
              onChange={(event) =>
                updateFilter("statusFilter", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processed">Procesado</option>
              <option value="failed">Fallido</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Filtrar por área</label>
            <select
              value={areaFilter}
              onChange={(event) => updateFilter("areaFilter", event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            >
              <option value="all">Todas</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Filtrar por clasificación
            </label>
            <select
              value={classificationFilter}
              onChange={(event) =>
                updateFilter("classificationFilter", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            >
              <option value="all">Todas</option>
              {availableClassifications.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha desde</label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(event) =>
                updateFilter("startDateFilter", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha hasta</label>
            <input
              type="date"
              value={endDateFilter}
              onChange={(event) =>
                updateFilter("endDateFilter", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Título
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Área
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Clasificación
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Fecha
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Estado
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-300">
                Acción
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-200">{report.id}</td>
                  <td className="px-4 py-3 text-white">{report.title}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {report.area || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {report.classification_label ? (
                      <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200">
                        {report.classification_label}
                      </span>
                    ) : (
                      <span className="text-slate-500">Sin procesar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {report.incident_date
                      ? new Date(report.incident_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                        report.status
                      )}`}
                    >
                      {formatStatusLabel(report.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectReport(report.id)}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-950"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No hay reportes que coincidan con la búsqueda o filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}