import { useState } from "react";
import UserAvatar from "../components/UserAvatar";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Usuario MVP",
    email: "usuario@correo.com",
    role: "Administrador",
    department: "Operaciones",
    phone: "+1 (809) 000-0000",
    password: "",
  });

  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setSaved(false);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <UserAvatar
              src="/profile-avatar.jpg"
              name={formData.name}
              size="xl"
              showStatus
            />

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Perfil de usuario
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {formData.name}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{formData.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
                  {formData.role}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
                  {formData.department}
                </span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  En línea
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-sm text-slate-400">Estado del perfil</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Esta sección representa la administración visual del usuario en el
              MVP. La persistencia real del perfil se plantea como evolución
              posterior.
            </p>
          </div>
        </div>
      </section>

      {saved && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Cambios guardados visualmente en el perfil del MVP.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-400">Información personal</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Datos principales
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Rol</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Departamento</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-400">Seguridad</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Acceso y credenciales
            </h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Contraseña</p>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nueva contraseña"
                className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-slate-500"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Este campo es visual dentro del MVP y no actualiza credenciales
                reales todavía.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Sesión actual</p>
              <p className="mt-2 text-sm text-slate-200">
                Usuario autenticado visualmente como{" "}
                <span className="font-semibold text-white">{formData.role}</span>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Guardar cambios
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}