import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";

export default function MainLayout({ children }) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isReportDetail =
    location.pathname.startsWith("/app/reports/") &&
    location.pathname !== "/app/reports" &&
    !location.pathname.endsWith("/edit") &&
    location.pathname !== "/app/reports/create" &&
    location.pathname !== "/app/reports/import";

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

  function navClass(isActive) {
    return `rounded-lg px-4 py-2 text-sm font-medium ${
      isActive
        ? "bg-white text-slate-950"
        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
    }`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header
        className={`sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">SentinelPredict</h1>
            <p className="text-sm text-slate-400">
              Gestión y análisis de incidentes industriales
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <nav className="flex flex-wrap gap-2">
              <NavLink
                to="/app"
                end
                className={({ isActive }) => navClass(isActive)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/app/reports"
                className={({ isActive }) => navClass(isActive)}
              >
                Reportes
              </NavLink>

              <NavLink
                to="/app/reports/create"
                className={({ isActive }) => navClass(isActive)}
              >
                Crear reporte
              </NavLink>

              <NavLink
                to="/app/reports/import"
                className={({ isActive }) => navClass(isActive)}
              >
                Importar CSV
              </NavLink>

              {isReportDetail && (
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Volver
                </button>
              )}
            </nav>

            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}