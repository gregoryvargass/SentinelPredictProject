import { useEffect, useMemo, useState } from "react";
import { getDashboardData } from "../services/api";
import BarChartCard from "../components/BarChartCard";
import TrendChartCard from "../components/TrendChartCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import StatCard from "../components/StatCard";
import { getPriorityBadgeClass, formatEntityLabel } from "../utils/formatters";
import { CalendarDays } from "lucide-react";

const ENTITY_GROUP_ORDER = [
  "PERSONA",
  "AREA",
  "EQUIPO",
  "CONDICION",
  "SUSTANCIA",
  "EVENTO",
];

function safeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeEntityText(text = "", label = "") {
  const rawText = safeText(text);
  const rawLabel = safeText(label);

  if (!rawText) return "Entidad no disponible";

  const value = rawText.toLowerCase();

  if (rawLabel === "PERSONA") {
    if (
      ["operario", "operador", "trabajador", "técnico", "tecnico", "supervisor"].includes(value)
    ) {
      return "Personal operativo";
    }
  }

  if (rawLabel === "AREA") {
    if (["producción", "produccion", "planta de producción", "planta de produccion"].includes(value)) {
      return "Producción";
    }

    if (["almacén", "almacen"].includes(value)) {
      return "Almacén";
    }

    if (["área de despacho", "area de despacho", "pasillo"].includes(value)) {
      return "Despacho y circulación";
    }

    if (value === "zona de carga") {
      return "Zona de carga";
    }

    if (value === "laboratorio") {
      return "Laboratorio";
    }
  }

  if (rawLabel === "EQUIPO") {
    if (
      ["máquina", "maquina", "máquina prensadora", "maquina prensadora", "equipo energizado"].includes(
        value
      )
    ) {
      return "Maquinaria y equipos";
    }

    if (value === "herramienta") {
      return "Herramientas";
    }

    if (value === "banda transportadora") {
      return "Bandas transportadoras";
    }

    if (["panel eléctrico", "panel electrico"].includes(value)) {
      return "Paneles eléctricos";
    }

    if (value === "montacargas") {
      return "Montacargas";
    }
  }

  if (rawLabel === "CONDICION") {
    if (["piso húmedo", "piso humedo", "superficie húmeda", "superficie humeda"].includes(value)) {
      return "Superficies húmedas";
    }

    if (["superficie resbalosa", "piso resbaloso"].includes(value)) {
      return "Superficies resbalosas";
    }

    if (value === "cable expuesto") {
      return "Cableado expuesto";
    }

    if (["señalización deficiente", "senalizacion deficiente"].includes(value)) {
      return "Señalización deficiente";
    }

    if (value === "recipiente mal cerrado") {
      return "Cierre inadecuado de recipientes";
    }

    if (["área obstruida", "area obstruida", "desorden general"].includes(value)) {
      return "Obstrucción y desorden";
    }
  }

  if (rawLabel === "SUSTANCIA") {
    if (["químico", "quimico", "sustancia", "solvente", "ácido", "acido"].includes(value)) {
      return "Sustancias químicas";
    }

    if (["líquido", "liquido", "aceite"].includes(value)) {
      return "Líquidos y aceites";
    }

    if (["líquido inflamable", "liquido inflamable", "vapores"].includes(value)) {
      return "Inflamables y vapores";
    }
  }

  if (rawLabel === "EVENTO") {
    if (["caída", "caida", "resbalón", "resbalon", "resbaló", "resbalo", "tropezó", "tropezo"].includes(value)) {
      return "Caídas y resbalones";
    }

    if (["derrame", "fuga"].includes(value)) {
      return "Derrames y fugas";
    }

    if (value === "golpe") {
      return "Golpes";
    }

    if (value === "atrapamiento") {
      return "Atrapamientos";
    }

    if (value === "descarga") {
      return "Descargas";
    }
  }

  return rawText.charAt(0).toUpperCase() + rawText.slice(1);
}

function getEntityGroupAccent(label) {
  switch (label) {
    case "PERSONA":
      return "border-sky-800/60 bg-sky-500/5";
    case "AREA":
      return "border-violet-800/60 bg-violet-500/5";
    case "EQUIPO":
      return "border-amber-800/60 bg-amber-500/5";
    case "CONDICION":
      return "border-rose-800/60 bg-rose-500/5";
    case "SUSTANCIA":
      return "border-emerald-800/60 bg-emerald-500/5";
    case "EVENTO":
      return "border-cyan-800/60 bg-cyan-500/5";
    default:
      return "border-slate-800 bg-slate-950";
  }
}

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

  const summary = dashboardData?.summary || {
    total_reports: 0,
    processed_reports: 0,
    pending_reports: 0,
    failed_reports: 0,
    most_common_incident: "No disponible",
    most_affected_area: "No disponible",
  };

  const incidentsByType = Array.isArray(dashboardData?.incidents_by_type)
    ? dashboardData.incidents_by_type
    : [];

  const incidentsByArea = Array.isArray(dashboardData?.incidents_by_area)
    ? dashboardData.incidents_by_area
    : [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const topEntities = Array.isArray(dashboardData?.top_entities)
    ? dashboardData.top_entities
    : [];

  const recommendations = Array.isArray(dashboardData?.recommendations)
    ? dashboardData.recommendations
    : [];

  const trends = Array.isArray(dashboardData?.trends)
    ? dashboardData.trends
    : [];

  const normalizedTopEntities = useMemo(() => {
    const groupedMap = new Map();

    topEntities.forEach((item) => {
      const label = safeText(item?.label);
      const text = safeText(item?.text);
      const count = Number(item?.count || 0);

      if (!label || !text) return;

      const normalizedText = normalizeEntityText(text, label);
      const key = `${label}::${normalizedText}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          label,
          text: normalizedText,
          count: 0,
        });
      }

      groupedMap.get(key).count += count;
    });

    return Array.from(groupedMap.values()).sort((a, b) => b.count - a.count);
  }, [topEntities]);

  const groupedEntityBlocks = useMemo(() => {
    return ENTITY_GROUP_ORDER.map((label) => {
      const items = normalizedTopEntities
        .filter((item) => item.label === label)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

      const total = normalizedTopEntities
        .filter((item) => item.label === label)
        .reduce((acc, item) => acc + item.count, 0);

      return {
        label,
        labelDisplay: formatEntityLabel(label),
        total,
        items,
      };
    }).filter((group) => group.items.length > 0);
  }, [normalizedTopEntities]);

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

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              SentinelPredict
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dashboard de análisis de incidentes industriales
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Visualiza tendencias, incidentes más comunes, áreas críticas y
              recomendaciones preventivas generadas a partir de reportes
              narrativos procesados por el sistema.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-sm text-slate-400">Resumen ejecutivo</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
              Se han procesado{" "}
              <span className="font-semibold text-white">
                {summary.processed_reports}
              </span>{" "}
              reportes. El incidente más frecuente es{" "}
              <span className="font-semibold text-white">
                {summary.most_common_incident || "no disponible"}
              </span>{" "}
              y el área con mayor recurrencia es{" "}
              <span className="font-semibold text-white">
                {summary.most_affected_area || "no disponible"}
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="w-full min-w-0 max-w-full space-y-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">
            Filtro temporal del dashboard
          </p>

          <p className="mt-1 text-slate-300">
            Selecciona un rango de fechas para analizar incidentes dentro de ese
            período.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
          <div className="min-w-0 space-y-2">
            <label className="text-sm text-slate-300">Fecha desde</label>

            <div className="relative min-w-0 max-w-full overflow-hidden">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="block w-full min-w-0 max-w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-base text-slate-100 outline-none focus:border-slate-500"
              />

              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <label className="text-sm text-slate-300">Fecha hasta</label>

            <div className="relative min-w-0 max-w-full overflow-hidden">
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="block w-full min-w-0 max-w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-base text-slate-100 outline-none focus:border-slate-500"
              />

              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <div className="flex min-w-0 items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full min-w-0 max-w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Limpiar filtro temporal
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de reportes"
          value={summary.total_reports}
          subtitle="Volumen total dentro del rango seleccionado."
          accent="slate"
        />

        <StatCard
          title="Procesados"
          value={summary.processed_reports}
          subtitle="Reportes ya analizados por el sistema."
          accent="emerald"
        />

        <StatCard
          title="Pendientes"
          value={summary.pending_reports}
          subtitle="Reportes aún sin procesamiento completo."
          accent="amber"
        />

        <StatCard
          title="Fallidos"
          value={summary.failed_reports}
          subtitle="Casos que requieren revisión técnica o de datos."
          accent="red"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <StatCard
          title="Incidente más común"
          value={summary.most_common_incident || "No disponible"}
          subtitle="Principal patrón de incidente detectado en el período."
          accent="violet"
        />

        <StatCard
          title="Área más afectada"
          value={summary.most_affected_area || "No disponible"}
          subtitle="Zona con mayor recurrencia de incidentes."
          accent="sky"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Incidentes por tipo"
          data={incidentsByType}
          xKey="label"
          dataKey="count"
        />

        <BarChartCard
          title="Incidentes por área"
          data={incidentsByArea}
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm text-slate-400">Hallazgos frecuentes</p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Entidades más frecuentes
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Las entidades se normalizan para agrupar sinónimos y mostrar una
              lectura más clara del comportamiento operativo.
            </p>
          </div>

          {groupedEntityBlocks.length > 0 ? (
            <div className="grid gap-4">
              {groupedEntityBlocks.map((group) => (
                <div
                  key={group.label}
                  className={`rounded-2xl border p-4 ${getEntityGroupAccent(group.label)}`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Tipo de entidad</p>
                      <h4 className="text-base font-semibold text-white">
                        {group.labelDisplay}
                      </h4>
                    </div>

                    <div className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-slate-200">
                      {group.total}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((item, index) => (
                      <div
                        key={`${group.label}-${item.text}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-white">{item.text}</p>
                          <p className="text-xs text-slate-500">
                            {group.labelDisplay}
                          </p>
                        </div>

                        <div className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No hay datos disponibles.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm text-slate-400">Acciones sugeridas</p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Recomendaciones
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
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