import { api } from "../lib/axios";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegistroDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginRespuesta {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}

export const authService = {
  login: async (datos: LoginDTO) => {
    const respuesta = await api.post<LoginRespuesta>("/auth/login", datos);

    return respuesta.data;
  },

  registro: async (datos: RegistroDTO) => {
    const respuesta = await api.post("/auth/register", datos);

    return respuesta.data;
  },
};
