export function isAuthenticated(): boolean {
  try {
    const token = localStorage.getItem("token");
    return !!token;
  } catch {
    return false;
  }
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}
