import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const guardado = localStorage.getItem("mercado-auth-storage");

  if (guardado) {
    try {
      const estado = JSON.parse(guardado);
      const token = estado.state?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Estado guardado inválido
    }
  }

  return config;
});
