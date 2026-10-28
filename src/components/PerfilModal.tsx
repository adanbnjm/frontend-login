import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { perfilService, type PerfilFormData } from "../service/perfil";
import { InputFotoPerfil } from "./InputFotoPerfil";

interface PerfilModalProps {
  onClose: () => void;
}

export function PerfilModal({ onClose }: PerfilModalProps) {
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar = useAuthStore((s) => s.usuarioAvatar);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);

  const [fotoArchivo, setFotoArchivo] = useState<File | undefined>();
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    defaultValues: { name: usuarioNombre ?? "" },
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      setErrorServidor("");
      setMensajeExito("");

      const perfil = await perfilService.actualizar(data, fotoArchivo);

      actualizarPerfil(perfil.name, perfil.avatar_url);

      setMensajeExito("Se actualizó con éxito");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setErrorServidor("Error al conectar con el servidor");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-slate-900 sm:p-8 animate-in fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Editar Mi Perfil</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="size-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-500 hover:bg-stone-200"
          >
            X
          </button>
        </div>

        {mensajeExito && (
          <div className="flex justify-center mb-6 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg">
            {mensajeExito}
          </div>
        )}

        {errorServidor && (
          <div className="flex justify-center mb-6 text-sm text-rose-600 bg-rose-50 p-2 rounded-lg">
            {errorServidor}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <InputFotoPerfil
            fotoActual={usuarioAvatar}
            iniciales={(usuarioNombre ?? "").substring(0, 2).toUpperCase()}
            onChange={(file) => setFotoArchivo(file)}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Nombre completo
            </label>

            <input
              {...register("name")}
              className="mt-1 h-11 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none transition"
            />

            {errors.name && (
              <span className="text-xs text-rose-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-stone-300 text-sm font-bold text-slate-700 hover:bg-stone-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
