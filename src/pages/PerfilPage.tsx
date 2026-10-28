import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Camera,
  Check,
  CircleUserRound,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { perfilService, type PerfilFormData } from "../service/perfil";
import { InputFotoPerfil } from "../components/InputFotoPerfil";

export default function PerfilPage() {
  const navigate = useNavigate();

  const { usuarioNombre, usuarioRol, usuarioAvatar, actualizarPerfil, logout } =
    useAuthStore();

  const [fotoArchivo, setFotoArchivo] = useState<File | undefined>();
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PerfilFormData>({
    defaultValues: {
      name: usuarioNombre ?? "",
    },
  });

  const iniciales = (usuarioNombre ?? "US")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  const guardarPerfil = async (data: PerfilFormData) => {
    if (!isDirty && !fotoArchivo) {
      setMensaje("No hay cambios para guardar.");
      setError("");
      return;
    }

    setGuardando(true);
    setMensaje("");
    setError("");

    try {
      const perfil = await perfilService.actualizar(data, fotoArchivo);

      actualizarPerfil(perfil.name, perfil.avatar_url);
      reset({ name: perfil.name });
      setFotoArchivo(undefined);
      setMensaje("Tu perfil se actualizó correctamente.");
    } catch {
      setError(
        "No se pudieron guardar los cambios. Comprueba tu conexión e inténtalo nuevamente.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const descartarCambios = () => {
    navigate("/");
  };

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#071321] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-[#091827] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            <CircleUserRound size={24} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-wide">
              FUNVAL<span className="text-cyan-400">.</span>
            </h1>
            <p className="text-xs text-slate-500">Panel de gestión</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={18} />
            Volver al dashboard
          </button>

          <div className="mt-8 px-4 text-xs font-bold uppercase tracking-widest text-slate-600">
            Cuenta
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300">
            <UserRound size={18} />
            Mi perfil
          </div>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={cerrarSesion}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-800 bg-[#091827]/80 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Cuenta / Perfil
            </p>
            <h2 className="mt-1 text-lg font-bold">Mi espacio</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {usuarioNombre || "Usuario"}
              </p>
              <p className="text-xs text-slate-500">
                {usuarioRol || "Usuario"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              {usuarioAvatar ? (
                <img
                  src={usuarioAvatar}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-cyan-300">
                  {iniciales}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-5 sm:p-8">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
              <ShieldCheck size={14} />
              Configuración de cuenta
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Mi <span className="text-cyan-400">Perfil</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Administra tu información personal y mantén actualizada tu foto de
              perfil.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(guardarPerfil)}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]"
          >
            <section className="h-fit overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1b2b]">
              <div className="h-24 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent" />

              <div className="-mt-12 px-6 pb-6">
                <div className="mb-5 flex justify-center">
                  <div className="relative rounded-full border-4 border-[#0b1b2b] bg-[#0b1b2b]">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-800">
                      {usuarioAvatar ? (
                        <img
                          src={usuarioAvatar}
                          alt="Foto actual del perfil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-cyan-300">
                          {iniciales}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0b1b2b] bg-cyan-400 text-slate-950">
                      <Camera size={15} />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold">
                    {usuarioNombre || "Tu nombre"}
                  </h3>

                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {usuarioRol || "Usuario"}
                  </p>
                </div>

                <div className="my-6 border-t border-slate-800" />

                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <ImagePlus size={17} className="text-cyan-400" />
                  Foto de perfil
                </div>

                <p className="mb-4 text-xs leading-5 text-slate-500">
                  Selecciona una imagen para actualizar tu foto.
                </p>

                <InputFotoPerfil
                  fotoActual={usuarioAvatar}
                  iniciales={iniciales}
                  onChange={(file: File | undefined) => {
                    setFotoArchivo(file);
                    setMensaje("");
                    setError("");
                  }}
                />

                <p className="mt-4 text-center text-xs text-slate-600">
                  Formatos de imagen compatibles según el selector de archivo.
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1b2b]">
              <div className="border-b border-slate-800 px-6 py-5 sm:px-8">
                <h3 className="text-lg font-bold">Información general</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Actualiza los datos disponibles de tu perfil.
                </p>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Escribe tu nombre"
                    {...register("name", {
                      required: "El nombre es obligatorio.",
                      minLength: {
                        value: 2,
                        message: "Escribe al menos 2 caracteres.",
                      },
                    })}
                    className="w-full rounded-xl border border-slate-700 bg-[#071321] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                  />

                  {errors.name && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#071321]/70 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Acceso y permisos
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Tu rol actual es{" "}
                        <span className="font-semibold text-cyan-300">
                          {usuarioRol || "Usuario"}
                        </span>
                        . Los permisos disponibles dependen de tu cuenta.
                      </p>
                    </div>
                  </div>
                </div>

                {mensaje && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                  >
                    <Check size={18} />
                    {mensaje}
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={descartarCambios}
                    disabled={guardando}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    <X size={17} />
                    Descartar
                  </button>

                  <button
                    type="submit"
                    disabled={guardando}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {guardando ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Save size={17} />
                    )}
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
