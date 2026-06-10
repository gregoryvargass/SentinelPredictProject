export default function Toast({ message, type = "info", onClose }) {
  const typeClasses = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-4 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${typeClasses[type]}`}
    >
      <p className="text-sm font-medium">{message}</p>

      <button
        onClick={onClose}
        className="text-xs font-semibold opacity-80 hover:opacity-100"
      >
        Cerrar
      </button>
    </div>
  );
}