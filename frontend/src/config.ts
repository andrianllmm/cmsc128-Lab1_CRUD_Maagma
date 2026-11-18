// Relative values (e.g. "/api/") resolve against the page's origin, for when the backend serves the frontend
export const API_URL = new URL(
  import.meta.env.VITE_API_URL ?? "/api/",
  window.location.origin,
).toString();
