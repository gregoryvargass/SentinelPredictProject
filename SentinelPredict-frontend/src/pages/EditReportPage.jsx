import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportFull, updateReport } from "../services/api";
import ReportDetailSkeleton from "../components/ReportDetailSkeleton";
import { CalendarDays } from "lucide-react";

export default function EditReportPage({
  onReportUpdated,
  onActionError,
}) {
  const { id } = useParams();
  const reportId = id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    source: "manual",
    area: "",
    incident_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const report = await getReportFull(reportId);

        setFormData({
          title: report.title || "",
          description: report.description || "",
          source: report.source || "manual",
          area: report.area || "",
          incident_date: report.incident_date
            ? new Date(report.incident_date).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        const message = err.message || "No se pudo cargar el reporte";
        setError(message);

        if (onActionError) {
          onActionError(message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      loadReport();
    }
  }, [reportId, onActionError]);

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

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        source: formData.source || "manual",
        area: formData.area || null,
        incident_date: formData.incident_date || null,
      };

      const updatedReport = await updateReport(reportId, payload);

      if (onReportUpdated) {
        onReportUpdated(updatedReport);
      }
    } catch (err) {
      const message = err.message || "No se pudo actualizar el reporte";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <ReportDetailSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-semibold text-white">Editar reporte</h2>
        <p className="mt-2 text-slate-400">
          Modifica la información básica del reporte seleccionado.
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

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Descripción narrativa</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Guardando cambios..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}