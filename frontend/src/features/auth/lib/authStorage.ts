const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setAuthTokens(token: string): void {
  setToken(token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);

  document.cookie = "refresh_token=; Max-Age=0; path=/; SameSite=None; Secure";
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
