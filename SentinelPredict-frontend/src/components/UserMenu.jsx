import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import UserAvatar from "./UserAvatar";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: "Usuario MVP",
    email: "usuario@correo.com",
    role: "Administrador",
    status: "En línea",
    avatar: "/profile-avatar.jpg",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleNavigate(path) {
    navigate(path);
    setOpen(false);
  }

  function handleLogout() {
    setShowLogoutModal(false);
    setOpen(false);
    navigate("/login");
  }

  return (
    <>
      <ConfirmModal
        open={showLogoutModal}
        title="Cerrar sesión"
        description="Vas a salir del entorno actual del MVP y regresar a la pantalla de inicio de sesión."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        confirmVariant="default"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-left shadow-sm transition hover:bg-slate-700"
        >
          <UserAvatar
            src={user.avatar}
            name={user.name}
            size="sm"
            showStatus
          />

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.role}</p>
          </div>

          <div
            className={`hidden text-slate-400 transition-transform sm:block ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </div>
        </button>

        <div
          className={`absolute right-0 z-[110] mt-3 w-80 origin-top-right overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-200 ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5">
            <div className="flex items-center gap-4">
              <UserAvatar
                src={user.avatar}
                name={user.name}
                size="lg"
                showStatus
              />

              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">
                  {user.name}
                </p>
                <p className="truncate text-sm text-slate-400">{user.email}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-medium text-slate-300">
                    {user.role}
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Cuenta
            </p>

            <button
              onClick={() => handleNavigate("/app/profile")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-base">
                👤
              </span>
              <div className="text-left">
                <p className="font-medium text-white">Ver perfil</p>
                <p className="text-xs text-slate-500">
                  Consultar y actualizar datos del usuario
                </p>
              </div>
            </button>

            <button
              onClick={() => handleNavigate("/login")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-base">
                🔄
              </span>
              <div className="text-left">
                <p className="font-medium text-white">Cambiar cuenta</p>
                <p className="text-xs text-slate-500">
                  Ir a la pantalla de inicio de sesión
                </p>
              </div>
            </button>
          </div>

          <div className="border-t border-slate-800 p-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-red-300 transition hover:bg-slate-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-base">
                ⎋
              </span>
              <div className="text-left">
                <p className="font-medium">Cerrar sesión</p>
                <p className="text-xs text-red-400/70">
                  Salir del entorno actual del MVP
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}