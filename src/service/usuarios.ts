import { api } from "../lib/axios";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const respuesta = await api.get<Usuario[]>("/users/");
    return respuesta.data;
  },
};
