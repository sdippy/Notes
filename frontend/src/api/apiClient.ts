import { getToken, removeToken } from "../auth/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...options.headers,

      ...API_URL(
        token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      ),
    },
  });
  if (response.status === 401) {
    removeToken();

    window.location.href = "/login";
  }

  return response;
}
