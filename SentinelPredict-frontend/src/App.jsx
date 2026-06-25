import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import CreateReportPage from "./pages/CreateReportPage";
import EditReportPage from "./pages/EditReportPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ImportReportsPage from "./pages/ImportReportsPage";
import LandingPage from "./pages/LandingPage";
import ToastContainer from "./components/ToastContainer";

const defaultReportsFilters = {
  searchTerm: "",
  statusFilter: "all",
  areaFilter: "all",
  classificationFilter: "all",
  startDateFilter: "",
  endDateFilter: "",
};

function AppContent() {
  const navigate = useNavigate();

  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [reportsFilters, setReportsFilters] = useState(defaultReportsFilters);
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "info") {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function handleReportCreated(createdReport) {
    setReportsRefreshKey((prev) => prev + 1);
    navigate(`/app/reports/${createdReport.id}`);
    showToast(`Reporte ${createdReport.id} creado correctamente.`, "success");
  }

  function handleReportProcessed() {
    setReportsRefreshKey((prev) => prev + 1);
    showToast("Reporte procesado correctamente.", "success");
  }

  function handleReportUpdated(updatedReport) {
    setReportsRefreshKey((prev) => prev + 1);
    navigate(`/app/reports/${updatedReport.id}`);
    showToast(`Reporte ${updatedReport.id} actualizado correctamente.`, "success");
  }

  function handleReportDeleted() {
    setReportsRefreshKey((prev) => prev + 1);
    navigate("/app/reports");
    showToast("Reporte eliminado correctamente.", "warning");
  }

  function handleReportsImported(createdReports) {
    setReportsRefreshKey((prev) => prev + 1);
    navigate("/app/reports");
    showToast(
      `${createdReports.length} reportes importados correctamente.`,
      "success"
    );
  }

  function handleActionError(message) {
    showToast(message, "error");
  }

  function handleDashboardDrillDown(partialFilters) {
    setReportsFilters((prev) => ({
      ...prev,
      ...partialFilters,
    }));
    navigate("/app/reports");
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/app"
          element={
            <MainLayout>
              <DashboardPage onDrillDown={handleDashboardDrillDown} />
            </MainLayout>
          }
        />

        <Route
          path="/app/reports"
          element={
            <MainLayout>
              <ReportsPage
                refreshKey={reportsRefreshKey}
                filters={reportsFilters}
                onFiltersChange={setReportsFilters}
                onSelectReport={(reportId) => navigate(`/app/reports/${reportId}`)}
              />
            </MainLayout>
          }
        />

        <Route
          path="/app/reports/create"
          element={
            <MainLayout>
              <CreateReportPage
                onReportCreated={handleReportCreated}
                onActionError={handleActionError}
              />
            </MainLayout>
          }
        />

        <Route
          path="/app/reports/import"
          element={
            <MainLayout>
              <ImportReportsPage
                onReportsImported={handleReportsImported}
                onActionError={handleActionError}
              />
            </MainLayout>
          }
        />

        <Route
          path="/app/reports/:id"
          element={
            <MainLayout>
              <ReportDetailPage
                onReportProcessed={handleReportProcessed}
                onEditReport={(reportId) =>
                  navigate(`/app/reports/${reportId}/edit`)
                }
                onReportDeleted={handleReportDeleted}
                onActionError={handleActionError}
              />
            </MainLayout>
          }
        />

        <Route
          path="/app/reports/:id/edit"
          element={
            <MainLayout>
              <EditReportPage
                onReportUpdated={handleReportUpdated}
                onActionError={handleActionError}
              />
            </MainLayout>
          }
        />

        <Route
          path="/app/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}