import { useState } from "react";

export default function UserAvatar({
  src = "/profile-avatar.jpg",
  alt = "Foto de perfil",
  name = "Usuario MVP",
  size = "md",
  showStatus = false,
}) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  function getInitials(fullName) {
    return fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="relative shrink-0">
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className={`rounded-full border border-slate-700 object-cover shadow-inner ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 font-bold text-white shadow-inner ${sizeClasses[size]}`}
        >
          {getInitials(name)}
        </div>
      )}

      {showStatus && (
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
      )}
    </div>
  );
}