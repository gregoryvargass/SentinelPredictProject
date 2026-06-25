import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import { isMvpAuthenticated } from "./utils/auth";

const defaultReportsFilters = {
  searchTerm: "",
  statusFilter: "all",
  areaFilter: "all",
  classificationFilter: "all",
  startDateFilter: "",
  endDateFilter: "",
};

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isMvpAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  if (isMvpAuthenticated()) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

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

  function handleLoginSuccess() {
    navigate("/app");
    showToast("Sesión iniciada correctamente.", "success");
  }

  function handleLogoutSuccess() {
    navigate("/login");
    showToast("Sesión cerrada correctamente.", "info");
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <DashboardPage onDrillDown={handleDashboardDrillDown} />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <ReportsPage
                  refreshKey={reportsRefreshKey}
                  filters={reportsFilters}
                  onFiltersChange={setReportsFilters}
                  onSelectReport={(reportId) => navigate(`/app/reports/${reportId}`)}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports/create"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <CreateReportPage
                  onReportCreated={handleReportCreated}
                  onActionError={handleActionError}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports/import"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <ImportReportsPage
                  onReportsImported={handleReportsImported}
                  onActionError={handleActionError}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports/:id"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <ReportDetailPage
                  onReportProcessed={handleReportProcessed}
                  onEditReport={(reportId) =>
                    navigate(`/app/reports/${reportId}/edit`)
                  }
                  onReportDeleted={handleReportDeleted}
                  onActionError={handleActionError}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports/:id/edit"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <EditReportPage
                  onReportUpdated={handleReportUpdated}
                  onActionError={handleActionError}
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/profile"
          element={
            <ProtectedRoute>
              <MainLayout onLogoutSuccess={handleLogoutSuccess}>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
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