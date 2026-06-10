import { useState } from "react";
import { createReport } from "../services/api";

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
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

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

      setSuccessMessage(`Reporte ${createdReport.id} creado correctamente.`);
      setFormData({
        title: "",
        description: "",
        source: "manual",
        area: "",
        incident_date: "",
      });

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
      <section>
        <h2 className="text-3xl font-semibold text-white">Crear reporte</h2>
        <p className="mt-2 text-slate-400">
          Registro manual de un nuevo incidente narrativo.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              placeholder="Ej. Resbalón en zona de carga"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Área</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              placeholder="Ej. Producción"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fuente</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              placeholder="manual"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Fecha del incidente</label>
            <input
              type="datetime-local"
              name="incident_date"
              value={formData.incident_date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Descripción narrativa</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
            placeholder="Describe el incidente con el mayor detalle posible..."
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar reporte"}
          </button>
        </div>
      </form>
    </div>
  );
}