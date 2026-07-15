import { useState } from "react";
import { createReport } from "../services/api";
import { CalendarDays } from "lucide-react";

export default function CreateReportPage({ onReportCreated, onActionError }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    source: "manual",
    area: "",
    incident_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleReset() {
    setFormData({
      title: "",
      description: "",
      source: "manual",
      area: "",
      incident_date: "",
    });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        source: formData.source || "manual",
        area: formData.area || null,
        incident_date: formData.incident_date || null,
      };

      const createdReport = await createReport(payload);

      if (onReportCreated) {
        onReportCreated(createdReport);
      }
    } catch (err) {
      const message = err.message || "Ocurrió un error creando el reporte";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Registro manual
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Crear nuevo reporte de incidente
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Registra manualmente un incidente narrativo para que pueda ser
              procesado, clasificado y analizado dentro de SentinelPredict.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-sm text-slate-400">Uso recomendado</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Usa esta opción cuando necesites documentar un incidente puntual
              con detalle y precisión desde cero.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
        >
          <div>
            <p className="text-sm text-slate-400">Información general</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Datos básicos del incidente
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej. Resbalón en zona de carga"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Área</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Ej. Producción"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Fuente</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="manual"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Fecha del incidente</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-slate-100 outline-none focus:border-slate-500"
                />
                <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-slate-400">Narrativa del incidente</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Descripción detallada
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Descripción narrativa</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={8}
              placeholder="Describe el incidente con el mayor detalle posible: qué ocurrió, dónde ocurrió, qué elementos estuvieron involucrados y cuál fue la condición observada."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpiar formulario
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Guardando reporte..." : "Guardar reporte"}
            </button>
          </div>
        </form>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Guía rápida</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Cómo redactar mejor un reporte
              </h3>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-medium text-white">Incluye contexto</p>
                <p className="mt-2 text-slate-400">
                  Explica dónde ocurrió, quién estuvo involucrado y bajo qué
                  condiciones se produjo el incidente.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-medium text-white">Describe el riesgo</p>
                <p className="mt-2 text-slate-400">
                  Menciona si hubo caída, derrame, cable expuesto, maquinaria,
                  postura, sustancia o cualquier condición observable.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-medium text-white">Sé específico</p>
                <p className="mt-2 text-slate-400">
                  Mientras más clara y precisa sea la narrativa, mejor podrá
                  clasificar y resumir el sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Ejemplo breve</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Referencia de narrativa
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm leading-7 text-slate-300">
                “Un operario resbaló en la zona de carga al caminar sobre una
                superficie húmeda por presencia de líquido derramado. El
                incidente ocurrió durante el turno matutino mientras se
                movilizaban materiales.”
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}