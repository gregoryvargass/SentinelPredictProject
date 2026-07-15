export default function Logo({
  variant = "brand",
  size = "md",
  className = "",
}) {
  const styles = {
    sm: {
      icon: "h-7 w-7",
      text: "text-lg",
      subtitle: "text-xs",
      gap: "gap-2",
    },
    md: {
      icon: "h-9 w-9",
      text: "text-xl",
      subtitle: "text-sm",
      gap: "gap-3",
    },
    lg: {
      icon: "h-12 w-12",
      text: "text-2xl",
      subtitle: "text-base",
      gap: "gap-3",
    },
    xl: {
      icon: "h-16 w-16",
      text: "text-4xl",
      subtitle: "text-lg",
      gap: "gap-4",
    },
  };

  const selected = styles[size] || styles.md;

  if (variant === "icon") {
    return (
      <img
        src="/branding/logo-icon.png"
        alt="SentinelPredict"
        className={`shrink-0 object-contain ${selected.icon} ${className}`}
        draggable={false}
      />
    );
  }

  if (variant === "horizontal") {
    return (
      <img
        src="/branding/logo-horizontal.png"
        alt="SentinelPredict"
        className={`h-12 w-auto max-w-full shrink-0 object-contain ${className}`}
        draggable={false}
      />
    );
  }

  return (
    <div
      className={`flex min-w-0 max-w-full items-center ${selected.gap} ${className}`}
    >
      <img
        src="/branding/logo-icon.png"
        alt=""
        aria-hidden="true"
        className={`shrink-0 object-contain ${selected.icon}`}
        draggable={false}
      />

      <div className="min-w-0 leading-none">
        <p
          className={`truncate font-semibold tracking-tight text-white ${selected.text}`}
        >
          SentinelPredict
        </p>
      </div>
    </div>
  );
}