import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">SentinelPredict</h1>
            <p className="text-sm text-slate-400">
              Gestión y análisis de incidentes industriales
            </p>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              href="#features"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Funcionalidades
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Flujo
            </a>
            <a
              href="#contact"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Contacto
            </a>

            <Link
              to="/login"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Plataforma inteligente
              </p>
              <h2 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-white">
                Centraliza, analiza y convierte reportes narrativos en decisiones
                preventivas.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                SentinelPredict permite registrar incidentes industriales,
                clasificarlos automáticamente, detectar entidades clave,
                resumir hallazgos y visualizar tendencias, riesgos y
                recomendaciones desde un dashboard unificado.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                >
                  Acceder a la plataforma
                </Link>

                <a
                  href="#features"
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                >
                  Ver funcionalidades
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Registro</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Reportes manuales y masivos
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Análisis</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    NLP, clasificación y resumen
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Visualización</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Dashboard, filtros y tendencias
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
              <p className="text-sm text-slate-400">Vista general del producto</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-semibold text-white">
                    1. Captura de incidentes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Registra incidentes desde formularios manuales o mediante
                    importación CSV.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-semibold text-white">
                    2. Procesamiento inteligente
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    El sistema genera clasificación, resumen y extracción de
                    entidades relevantes.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-semibold text-white">
                    3. Toma de decisiones
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Visualiza métricas, riesgos frecuentes, recomendaciones y
                    tendencias desde el dashboard.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-semibold text-white">
                    4. Gestión operativa
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Consulta, filtra, exporta y mantiene trazabilidad sobre los
                    reportes registrados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Funcionalidades
            </p>
            <h3 className="mt-3 text-3xl font-bold text-white">
              Todo lo que hace SentinelPredict
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              La plataforma cubre el flujo completo desde el registro del
              incidente hasta su análisis y visualización estratégica.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Registro</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Crear y editar reportes
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Captura manualmente incidentes narrativos y mantén su
                información actualizada.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Importación</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Carga masiva por CSV
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Importa múltiples reportes en lote con previsualización antes de
                guardarlos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Procesamiento NLP</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Clasificación automática
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Identifica el tipo de incidente a partir de la narrativa
                registrada.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Extracción</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Entidades y resumen
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Detecta elementos importantes del incidente y genera un resumen
                procesado.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Analítica</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Dashboard estratégico
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Visualiza métricas, tendencias, áreas afectadas y tipos de
                incidentes más frecuentes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Acción</p>
              <h4 className="mt-2 text-xl font-semibold text-white">
                Recomendaciones y exportación
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Obtén recomendaciones preventivas y exporta reportes filtrados a
                CSV.
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-slate-800 bg-slate-900/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Flujo de uso
              </p>
              <h3 className="mt-3 text-3xl font-bold text-white">
                Cómo se utiliza la plataforma
              </h3>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  1
                </div>
                <h4 className="mt-4 text-lg font-semibold text-white">
                  Ingreso
                </h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  El usuario entra por la landing y accede al sistema desde el
                  login.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  2
                </div>
                <h4 className="mt-4 text-lg font-semibold text-white">
                  Registro
                </h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Se crean reportes manualmente o se importan desde CSV.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  3
                </div>
                <h4 className="mt-4 text-lg font-semibold text-white">
                  Análisis
                </h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  El sistema procesa la narrativa y genera clasificación,
                  resumen y entidades.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  4
                </div>
                <h4 className="mt-4 text-lg font-semibold text-white">
                  Decisión
                </h4>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Se revisan dashboards, riesgos frecuentes y recomendaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Contacto
                </p>
                <h3 className="mt-3 text-3xl font-bold text-white">
                  ¿Quieres conocer más del producto?
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  SentinelPredict está diseñado para fortalecer la gestión y el
                  análisis de incidentes industriales a partir de reportes
                  narrativos y visualización operativa.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Canales</p>
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  <p>
                    Correo:{" "}
                    <span className="font-semibold text-white">
                      contacto@sentinelpredict.com
                    </span>
                  </p>
                  <p>
                    Teléfono:{" "}
                    <span className="font-semibold text-white">
                      +1 (809) 000-0000
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                  >
                    Entrar a la plataforma
                  </Link>
                  <a
                    href="mailto:contacto@sentinelpredict.com"
                    className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}