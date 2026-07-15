import { useEffect, useMemo, useState } from "react";
import { getReports } from "../services/api";
import { formatStatusLabel, getStatusBadgeClass } from "../utils/formatters";
import { exportReportsToCsv } from "../utils/csv";
import ReportsTableSkeleton from "../components/ReportsTableSkeleton";
import EmptyState from "../components/EmptyState";
import { CalendarDays } from "lucide-react";

const ITEMS_PER_PAGE = 5;

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [];

  pages.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("left-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export default function ReportsPage({
  onSelectReport,
  refreshKey,
  filters,
  onFiltersChange,
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const data = await getReports();
        setReports(data);
        setError("");
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
      } else if (startDateFilter || endDateFilter) {
        matchesStartDate = false;
        matchesEndDate = false;
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  const visiblePages = useMemo(() => {
    return getVisiblePages(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const processedCount = filteredReports.filter(
    (report) => report.status === "processed"
  ).length;

  const pendingCount = filteredReports.filter(
    (report) => report.status === "pending"
  ).length;

  function clearFilters() {
    onFiltersChange({
      searchTerm: "",
      statusFilter: "all",
      areaFilter: "all",
      classificationFilter: "all",
      startDateFilter: "",
      endDateFilter: "",
    });
    setCurrentPage(1);
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (loading) {
    return <ReportsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
        <p className="text-lg font-semibold text-red-300">Ocurrió un error</p>
        <p className="mt-2 text-sm leading-6 text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Gestión documental
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Consulta y explora los reportes del sistema
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Filtra, revisa y exporta reportes narrativos registrados en
              SentinelPredict para identificar incidentes, áreas recurrentes y
              estados de procesamiento.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-sm text-slate-400">Resumen visible</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Actualmente se muestran{" "}
              <span className="font-semibold text-white">
                {filteredReports.length}
              </span>{" "}
              reportes del total registrado.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Reportes visibles</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {filteredReports.length}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Registros dentro de los filtros activos.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-sm">
          <p className="text-sm text-slate-300">Procesados</p>
          <p className="mt-2 text-3xl font-bold text-white">{processedCount}</p>
          <p className="mt-2 text-sm text-slate-200">
            Reportes ya analizados por el sistema.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 shadow-sm">
          <p className="text-sm text-slate-300">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-white">{pendingCount}</p>
          <p className="mt-2 text-sm text-slate-200">
            Casos todavía sin procesamiento completo.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Acciones disponibles</p>
            <p className="mt-2 text-slate-200">
              Exporta todos los resultados filtrados a un archivo CSV para
              revisión externa o respaldo.
            </p>
          </div>

          <button
            onClick={() =>
              exportReportsToCsv(filteredReports, "sentinelpredict-reportes.csv")
            }
            disabled={filteredReports.length === 0}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
        <div>
          <p className="text-sm text-slate-400">Filtros de consulta</p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            Ajusta la vista de reportes
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => updateFilter("searchTerm", event.target.value)}
              placeholder="Título, descripción, área..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Filtrar por estado</label>
            <select
              value={statusFilter}
              onChange={(event) => updateFilter("statusFilter", event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
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
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
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
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.9fr]">
                  <div className="space-y-2">
          <label className="text-sm text-slate-300">Fecha desde</label>
          <div className="relative">
            <input
              type="date"
              value={startDateFilter}
              onChange={(event) =>
                updateFilter("startDateFilter", event.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-slate-100 outline-none focus:border-slate-500"
            />
            <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
          </div>
        </div>

         <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha hasta</label>
            <div className="relative">
              <input
                type="date"
                value={endDateFilter}
                onChange={(event) =>
                  updateFilter("endDateFilter", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-slate-100 outline-none focus:border-slate-500"
              />
              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur">
              <tr>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  ID
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Título
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Área
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Clasificación
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Fecha
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Estado
                </th>
                <th className="px-4 py-4 text-left font-medium text-slate-300">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-4 align-top text-slate-400">
                      #{report.id}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="font-medium text-white">{report.title}</p>
                      <p className="mt-2 max-w-md text-xs leading-6 text-slate-500">
                        {report.description || "Sin descripción"}
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top text-slate-300">
                      {report.area || "N/A"}
                    </td>

                    <td className="px-4 py-4 align-top text-slate-300">
                      {report.classification_label ? (
                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200">
                          {report.classification_label}
                        </span>
                      ) : (
                        <span className="text-slate-500">Sin procesar</span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top text-slate-300">
                      {report.incident_date
                        ? new Date(report.incident_date).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                          report.status
                        )}`}
                      >
                        {formatStatusLabel(report.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <button
                        onClick={() => onSelectReport(report.id)}
                        className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:opacity-90"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8">
                    <EmptyState
                      title="No hay reportes para mostrar"
                      description="No se encontraron reportes que coincidan con la búsqueda o los filtros aplicados. Ajusta los filtros o limpia la búsqueda para ver más resultados."
                      actionLabel="Limpiar filtros"
                      onAction={clearFilters}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length > 0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            Página <span className="font-semibold text-white">{currentPage}</span>{" "}
            de <span className="font-semibold text-white">{totalPages}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            {visiblePages.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[42px] rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-white text-slate-950"
                      : "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`${page}-${index}`}
                  className="px-2 text-sm font-semibold text-slate-500"
                >
                  ...
                </span>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </section>
      )}
    </div>
  );
}