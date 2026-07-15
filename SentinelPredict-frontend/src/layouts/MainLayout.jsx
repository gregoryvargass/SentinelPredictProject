import { useEffect, useRef, useState } from "react";
import { Link,NavLink, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import UserMenu from "../components/UserMenu";
import Logo from "../components/Logo";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout({ children, onLogoutSuccess }) {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { theme, toggleTheme, isDark } = useTheme();

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function navClass(isActive) {
    return `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-white text-slate-950"
        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
    }`;
  }

  function mobileNavClass(isActive) {
    return `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-white text-slate-950"
        : "bg-slate-950 text-slate-200 hover:bg-slate-800"
    }`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header
        className={`sticky top-0 z-50 w-full max-w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <Link
              to="/app"
              aria-label="Ir al dashboard de SentinelPredict"
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Logo variant="icon" size="md" />

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                  SentinelPredict
                </p>

                <p className="hidden truncate text-xs text-slate-400 sm:block lg:text-sm">
                  Gestión y análisis de incidentes industriales
                </p>
              </div>
            </Link>

            <div className="hidden xl:flex xl:items-center xl:gap-3">
              <nav className="flex items-center gap-2">
                <NavLink to="/app" end className={({ isActive }) => navClass(isActive)}>
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
                    className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                  >
                    Volver
                  </button>
                )}
              </nav>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-700"
                aria-label={
                  isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
                }
                title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? "Claro" : "Oscuro"}</span>
              </button>

              <UserMenu onLogoutSuccess={onLogoutSuccess} />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-100 transition hover:bg-slate-700 xl:hidden"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 space-y-4 xl:hidden">
              <nav className="grid gap-2">
                <NavLink
                  to="/app"
                  end
                  className={({ isActive }) => mobileNavClass(isActive)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/app/reports"
                  className={({ isActive }) => mobileNavClass(isActive)}
                >
                  Reportes
                </NavLink>

                <NavLink
                  to="/app/reports/create"
                  className={({ isActive }) => mobileNavClass(isActive)}
                >
                  Crear reporte
                </NavLink>

                <NavLink
                  to="/app/reports/import"
                  className={({ isActive }) => mobileNavClass(isActive)}
                >
                  Importar CSV
                </NavLink>

                {isReportDetail && (
                  <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Volver
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>
                    Cambiar a tema {isDark ? "claro" : "oscuro"}
                  </span>
                </button>
              </nav>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
                <UserMenu onLogoutSuccess={onLogoutSuccess} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden px-4 py-8 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-10">
        {children}
      </main>
    </div>
  );
}