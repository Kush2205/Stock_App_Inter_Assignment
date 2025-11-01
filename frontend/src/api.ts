export const getBackendUrl = () => {
  // Vite environment variable for backend URL: VITE_BACKEND_URL
  // Fallback to localhost:4000 for local dev
  // Note: set VITE_BACKEND_URL in frontend/.env for production or deployment
  // Example: VITE_BACKEND_URL=https://your-backend.example.com
  // import.meta.env is provided by Vite
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const url = import.meta.env?.VITE_BACKEND_URL || "http://localhost:4000";
  return url;
};

export const authFetch = async (path: string, options: RequestInit = {}, token?: string) => {
  const base = getBackendUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path}`, { ...options, headers });
  return res;
};
