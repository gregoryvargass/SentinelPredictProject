const AUTH_STORAGE_KEY = "sentinelpredict_auth";

export function loginMvpSession() {
  const session = {
    isAuthenticated: true,
    loginAt: new Date().toISOString(),
    user: {
      name: "Usuario MVP",
      email: "usuario@correo.com",
      role: "Administrador",
      status: "En línea",
      avatar: "/profile-avatar.jpg",
    },
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logoutMvpSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getMvpSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isMvpAuthenticated() {
  const session = getMvpSession();
  return Boolean(session?.isAuthenticated);
}