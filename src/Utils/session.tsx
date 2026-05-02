const SESSION_KEY = "active_session_code";

export const getSession = () => localStorage.getItem(SESSION_KEY);

export const setSession = (code) =>
  localStorage.setItem(SESSION_KEY, code);

export const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);
