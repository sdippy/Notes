import { getToken, removeToken, setToken } from "@/features/auth/lib/authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  canRefresh = true,
): Promise<Response> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  if (response.status === 401 && canRefresh) {
    const refreshResponse = await fetch(`${API_URL}/Auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshResponse.ok) {
      const tokens: { token: string } = await refreshResponse.json();
      setToken(tokens.token);
      return apiFetch(path, options, false);
    }

    removeToken();
    window.location.href = "/login";
  }

  return response;
}
