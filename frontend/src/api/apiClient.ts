import {
  getRefreshToken,
  getToken,
  removeToken,
  setToken,
  setRefreshToken,
} from "../auth/authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  canRefresh = true,
): Promise<Response> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,

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
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/Auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const tokens: { token: string; refreshToken: string } =
          await refreshResponse.json();
        setToken(tokens.token);
        setRefreshToken(tokens.refreshToken);
        return apiFetch(path, options, false);
      }
    }

    removeToken();
    window.location.href = "/login";
  }

  return response;
}
