import Toast from "./Toast";

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}