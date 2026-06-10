import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import CreateReportPage from "./pages/CreateReportPage";
import EditReportPage from "./pages/EditReportPage";
import ToastContainer from "./components/ToastContainer";

const defaultReportsFilters = {
  searchTerm: "",
  statusFilter: "all",
  areaFilter: "all",
  classificationFilter: "all",
  startDateFilter: "",
  endDateFilter: "",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [reportsFilters, setReportsFilters] = useState(defaultReportsFilters);
  const [reportsScrollY, setReportsScrollY] = useState(0);
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

  function handleNavigate(page) {
    setCurrentPage(page);

    if (page !== "report-detail" && page !== "edit-report") {
      setSelectedReportId(null);
    }
  }

  function handleSelectReport(reportId) {
    setReportsScrollY(window.scrollY);
    setSelectedReportId(reportId);
    setCurrentPage("report-detail");
  }

  function handleEditReport(reportId) {
    setSelectedReportId(reportId);
    setCurrentPage("edit-report");
  }

  function handleBackToReports() {
    setCurrentPage("reports");
  }

  function handleReportCreated(createdReport) {
    setReportsRefreshKey((prev) => prev + 1);
    setSelectedReportId(createdReport.id);
    setCurrentPage("report-detail");
    showToast(`Reporte ${createdReport.id} creado correctamente.`, "success");
  }

  function handleReportProcessed() {
    setReportsRefreshKey((prev) => prev + 1);
    showToast("Reporte procesado correctamente.", "success");
  }

  function handleReportUpdated(updatedReport) {
    setReportsRefreshKey((prev) => prev + 1);
    setSelectedReportId(updatedReport.id);
    setCurrentPage("report-detail");
    showToast(`Reporte ${updatedReport.id} actualizado correctamente.`, "success");
  }

  function handleReportDeleted() {
    setReportsRefreshKey((prev) => prev + 1);
    setSelectedReportId(null);
    setCurrentPage("reports");
    showToast("Reporte eliminado correctamente.", "warning");
  }

  function handleActionError(message) {
    showToast(message, "error");
  }

  function handleDashboardDrillDown(partialFilters) {
    setReportsFilters((prev) => ({
      ...prev,
      ...partialFilters,
    }));
    setCurrentPage("reports");
  }

  useEffect(() => {
    if (currentPage === "reports") {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: reportsScrollY,
          behavior: "auto",
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentPage, reportsScrollY]);

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <MainLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onBackToReports={handleBackToReports}
      >
        {currentPage === "dashboard" && (
          <DashboardPage onDrillDown={handleDashboardDrillDown} />
        )}

        {currentPage === "reports" && (
          <ReportsPage
            onSelectReport={handleSelectReport}
            refreshKey={reportsRefreshKey}
            filters={reportsFilters}
            onFiltersChange={setReportsFilters}
          />
        )}

        {currentPage === "report-detail" && (
          <ReportDetailPage
            reportId={selectedReportId}
            onReportProcessed={handleReportProcessed}
            onEditReport={handleEditReport}
            onReportDeleted={handleReportDeleted}
            onActionError={handleActionError}
          />
        )}

        {currentPage === "edit-report" && (
          <EditReportPage
            reportId={selectedReportId}
            onReportUpdated={handleReportUpdated}
            onActionError={handleActionError}
          />
        )}

        {currentPage === "create-report" && (
          <CreateReportPage
            onReportCreated={handleReportCreated}
            onActionError={handleActionError}
          />
        )}
      </MainLayout>
    </>
  );
}