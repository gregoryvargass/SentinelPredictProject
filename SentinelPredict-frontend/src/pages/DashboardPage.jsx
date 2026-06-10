import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import BarChartCard from "../components/BarChartCard";
import TrendChartCard from "../components/TrendChartCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { getPriorityBadgeClass, formatEntityLabel } from "../utils/formatters";

export default function DashboardPage({ onDrillDown }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardData(filters);
        setDashboardData(data);
        setError("");
      } catch (err) {
        setError(err.message || "Ocurrió un error cargando el dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [filters]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      startDate: "",
      endDate: "",
    });
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const {
    summary,
    incidents_by_type,
    incidents_by_area,
    top_entities,
    recommendations,
    trends,
  } = dashboardData;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">
          Vista general del sistema SentinelPredict.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <p className="text-sm text-slate-400">Filtro temporal del dashboard</p>
          <p className="mt-1 text-slate-300">
            Selecciona un rango de fechas para analizar incidentes dentro de ese período.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha desde</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha hasta</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Limpiar filtro temporal
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Resumen ejecutivo</p>
        <p className="mt-2 leading-7 text-slate-200">
          SentinelPredict ha procesado{" "}
          <span className="font-semibold text-white">
            {summary.processed_reports}
          </span>{" "}
          reportes. El tipo de incidente más frecuente es{" "}
          <span className="font-semibold text-white">
            {summary.most_common_incident || "no disponible"}
          </span>{" "}
          y el área con mayor recurrencia es{" "}
          <span className="font-semibold text-white">
            {summary.most_affected_area || "no disponible"}
          </span>
          .
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total de reportes</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.total_reports}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Procesados</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.processed_reports}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.pending_reports}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Fallidos</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {summary.failed_reports}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Incidente más común</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {summary.most_common_incident || "No disponible"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Área más afectada</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {summary.most_affected_area || "No disponible"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Incidentes por tipo"
          data={incidents_by_type}
          xKey="label"
          dataKey="count"
        />

        <BarChartCard
          title="Incidentes por área"
          data={incidents_by_area}
          xKey="area"
          dataKey="count"
          onBarClick={(entry) => {
            if (onDrillDown) {
              onDrillDown({
                areaFilter: entry.area,
              });
            }
          }}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">
            Entidades más frecuentes
          </h3>

          <div className="mt-4 space-y-3">
            {top_entities.length > 0 ? (
              top_entities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{item.text}</p>
                    <p className="text-xs text-slate-500">
                      {formatEntityLabel(item.label)}
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
                    {item.count}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No hay datos disponibles.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">Recomendaciones</h3>
          <div className="mt-4 space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.reason}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getPriorityBadgeClass(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">
                No hay recomendaciones disponibles.
              </p>
            )}
          </div>
        </div>
      </section>

      <TrendChartCard title="Tendencias de incidentes" data={trends} />
    </div>
  );
}