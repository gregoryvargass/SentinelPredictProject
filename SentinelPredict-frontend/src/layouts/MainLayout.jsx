import { useEffect, useRef, useState } from "react";

export default function MainLayout({
  children,
  currentPage,
  onNavigate,
  onBackToReports,
}) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowHeader(true);
      } else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header
        className={`sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">SentinelPredict</h1>
            <p className="text-sm text-slate-400">
              Gestión y análisis de incidentes industriales
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                currentPage === "dashboard"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate("reports")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                currentPage === "reports"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              Reportes
            </button>

            <button
              onClick={() => onNavigate("create-report")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                currentPage === "create-report"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              Crear reporte
            </button>

            {currentPage === "report-detail" && (
              <button
                onClick={onBackToReports}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
              >
                Volver a reportes
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}