import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { loginMvpSession } from "../utils/auth";

export default function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    loginMvpSession();

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10">
            <div>
              <Link
                to="/"
                aria-label="Volver a la página de inicio"
                className="inline-flex text-sm uppercase tracking-[0.25em] text-slate-400 transition hover:text-white"
              >
                SentinelPredict
              </Link>

              <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-white">
                Inteligencia para analizar incidentes industriales
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                Centraliza reportes narrativos, clasifica incidentes, detecta
                entidades relevantes y genera hallazgos preventivos desde un
                dashboard visual y operativo.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur">
                <p className="text-sm text-slate-400">
                  Capacidades del sistema
                </p>

                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li>• Clasificación automática de incidentes</li>
                  <li>• Resumen y extracción de entidades</li>
                  <li>• Dashboard con tendencias y recomendaciones</li>
                  <li>• Gestión, importación y exportación de reportes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 items-center justify-center px-4 py-8 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <div className="w-full min-w-0 max-w-md">
            <Link
              to="/"
              aria-label="Volver a la página de inicio"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                aria-label="Volver a la página de inicio"
                className="inline-flex text-sm uppercase tracking-[0.25em] text-slate-400 transition hover:text-white"
              >
                SentinelPredict
              </Link>

              <h1 className="mt-3 text-3xl font-bold text-white">
                Iniciar sesión
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Accede al sistema para gestionar reportes y visualizar análisis
                de incidentes industriales.
              </p>
            </div>

            <div className="w-full min-w-0 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur sm:p-8">
              <div className="hidden lg:block">
                <h2 className="text-3xl font-semibold text-white">
                  Iniciar sesión
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Accede a tu panel de análisis y gestión de incidentes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="min-w-0 space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-300"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="block w-full min-w-0 max-w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-slate-500"
                    placeholder="usuario@correo.com"
                  />
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-300"
                    >
                      Contraseña
                    </label>

                    <button
                      type="button"
                      className="shrink-0 text-xs font-medium text-slate-400 hover:text-slate-200"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="block w-full min-w-0 max-w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-slate-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                >
                  Entrar al sistema
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Acceso MVP
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Esta pantalla representa el acceso al sistema dentro del MVP.
                  La autenticación se simula mediante sesión local para dar una
                  experiencia más real al flujo público/privado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}