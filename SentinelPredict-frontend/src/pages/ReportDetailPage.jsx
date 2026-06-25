import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportFull, processReport, deleteReport } from "../services/api";
import ReportDetailSkeleton from "../components/ReportDetailSkeleton";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import {
  formatStatusLabel,
  getStatusBadgeClass,
  formatEntityLabel,
  getRecommendationByClassification,
} from "../utils/formatters";

export default function ReportDetailPage({
  onReportProcessed,
  onEditReport,
  onReportDeleted,
  onActionError,
}) {
  const { id } = useParams();
  const reportId = id;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setLoading(true);
      const data = await getReportFull(reportId);
      setReport(data);
      setError("");
    } catch (err) {
      const message = err.message || "Ocurrió un error cargando el reporte";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (reportId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  async function handleProcessReport() {
    try {
      setProcessing(true);
      await processReport(reportId);
      await loadReport();

      if (onReportProcessed) {
        onReportProcessed();
      }
    } catch (err) {
      const message = err.message || "No se pudo procesar el reporte";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setProcessing(false);
    }
  }

  async function handleConfirmDelete() {
    try {
      setDeleting(true);
      await deleteReport(report.id);
      setShowDeleteModal(false);

      if (onReportDeleted) {
        onReportDeleted();
      }
    } catch (err) {
      const message = err.message || "No se pudo eliminar el reporte";
      setError(message);

      if (onActionError) {
        onActionError(message);
      }
    } finally {
      setDeleting(false);
    }
  }

  if (!reportId) {
    return (
      <EmptyState
        title="No se seleccionó ningún reporte"
        description="Selecciona un reporte desde la tabla para ver su detalle, clasificación, entidades y recomendaciones."
      />
    );
  }

  if (loading) {
    return <ReportDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
        <p className="text-lg font-semibold text-red-300">Ocurrió un error</p>
        <p className="mt-2 text-sm leading-6 text-red-200">{error}</p>
      </div>
    );
  }

  const classificationLabel = report.classification?.label || null;
  const recommendation = classificationLabel
    ? getRecommendationByClassification(classificationLabel)
    : null;

  return (
    <>
      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar reporte"
        description="Esta acción eliminará el reporte de forma permanente. No se podrá deshacer."
        confirmLabel="Eliminar reporte"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Detalle del reporte</h2>
            <p className="mt-2 text-slate-400">
              Visualización completa del reporte y su análisis automatizado.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEditReport && onEditReport(report.id)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
            >
              Editar reporte
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/60"
            >
              Eliminar reporte
            </button>

            <button
              onClick={handleProcessReport}
              disabled={processing || report.status === "processed"}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? "Procesando..."
                : report.status === "processed"
                ? "Ya procesado"
                : "Procesar reporte"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-400">Título del incidente</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{report.title}</h3>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(
                report.status
              )}`}
            >
              {formatStatusLabel(report.status)}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-sm text-slate-400">ID</p>
              <p className="text-slate-100">{report.id}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Área</p>
              <p className="text-slate-100">{report.area || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Fuente</p>
              <p className="text-slate-100">{report.source || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Fecha del incidente</p>
              <p className="text-slate-100">
                {report.incident_date
                  ? new Date(report.incident_date).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-400">Descripción narrativa</p>
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="leading-7 text-slate-200">{report.description}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-sm text-slate-400">Clasificación del incidente</p>

            {report.classification ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Tipo identificado</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {report.classification.label}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Confianza</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {(report.classification.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Modelo</p>
                    <p className="mt-2 text-sm font-medium text-slate-200">
                      {report.classification.model_name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="Sin clasificación disponible"
                  description="Este reporte aún no ha sido clasificado por el sistema."
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <p className="text-sm text-slate-400">Resumen generado</p>

            {report.summary ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="leading-7 text-slate-200">{report.summary.content}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Modelo utilizado</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {report.summary.model_name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="Sin resumen disponible"
                  description="Este reporte aún no tiene un resumen generado por el sistema."
                />
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Entidades detectadas</p>

          {report.entities && report.entities.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {report.entities.map((entity) => (
                <div
                  key={entity.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <p className="font-medium text-white">{entity.text}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatEntityLabel(entity.label)}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Confianza: {(entity.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No se detectaron entidades"
                description="Este reporte no generó entidades reconocibles dentro del análisis actual del sistema."
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <p className="text-sm text-slate-400">Interpretación y recomendación</p>

          {classificationLabel ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="font-semibold text-white">
                Recomendación sugerida para {classificationLabel}
              </p>
              <p className="mt-3 leading-7 text-slate-300">{recommendation}</p>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Sin recomendación disponible"
                description="El sistema aún no puede generar una recomendación porque el reporte no ha sido procesado o no tiene clasificación asignada."
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
}