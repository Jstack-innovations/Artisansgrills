import { API_BASE } from "../Config/api";

export async function checkSession(code) {
  try {
    const res = await fetch(`${API_BASE}/getSession?code=${code}`);
    return await res.json();
  } catch {
    return null;
  }
}
