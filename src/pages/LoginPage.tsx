import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Layers3,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [errorServidor, setErrorServidor] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (datos: LoginFormData) => {
    try {
      setErrorServidor("");

      const respuesta = await authService.login(datos);

      login(respuesta.access_token, respuesta.user_name, respuesta.user_role);

      navigate("/", { replace: true });
    } catch {
      setErrorServidor(
        "No se pudo iniciar sesión. Revisa tu correo y contraseña e inténtalo de nuevo.",
      );
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#051424] px-4 py-10 text-[#d4e4fa]">
      {/* Brillos decorativos del fondo */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      <section className="relative z-10 w-full max-w-md">
        {/* Marca */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="group relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-xl transition group-hover:bg-blue-400/50" />

            <div className="relative grid size-16 place-items-center rounded-2xl border border-white/10 bg-[#1c2b3c] shadow-2xl">
              <Layers3
                size={34}
                strokeWidth={1.7}
                className="text-[#adc6ff] transition-transform group-hover:rotate-6"
              />
            </div>

            <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#051424] bg-[#4edea3]" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#122131] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            <span className="size-1.5 rounded-full bg-[#4edea3]" />
            Plataforma de e-commerce
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            NovaTech
          </h1>

          <p className="mt-2 text-sm text-[#9baec5]">
            Accede a tu cuenta y administra tu espacio.
          </p>
        </div>

        {/* Tarjeta de acceso */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#122131]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">Iniciar sesión</h2>
            <p className="mt-1 text-sm text-[#9baec5]">
              Introduce tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Correo */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#c2c6d6]"
              >
                Correo electrónico
              </label>

              <div
                className={`flex items-center rounded-xl border bg-[#010f1f] transition focus-within:border-[#adc6ff] ${
                  errors.email ? "border-rose-500/70" : "border-[#273647]"
                }`}
              >
                <Mail size={19} className="ml-3 shrink-0 text-[#8c909f]" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu.correo@ejemplo.com"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#66778c]"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="mt-2 text-xs text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#c2c6d6]"
                >
                  Contraseña
                </label>
              </div>

              <div
                className={`flex items-center rounded-xl border bg-[#010f1f] transition focus-within:border-[#adc6ff] ${
                  errors.password ? "border-rose-500/70" : "border-[#273647]"
                }`}
              >
                <LockKeyhole
                  size={19}
                  className="ml-3 shrink-0 text-[#8c909f]"
                />

                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#66778c]"
                  {...register("password")}
                />

                <button
                  type="button"
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  onClick={() => setMostrarPassword((actual) => !actual)}
                  className="mr-2 rounded-lg p-2 text-[#8c909f] transition hover:bg-[#273647] hover:text-white"
                >
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error de la API */}
            {errorServidor && (
              <div
                role="alert"
                className="flex gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
              >
                <ShieldCheck size={19} className="shrink-0" />
                <p>{errorServidor}</p>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4d8eff] px-4 py-3.5 font-semibold text-[#00285d] shadow-lg shadow-blue-500/10 transition hover:bg-[#adc6ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isSubmitting ? "Autenticando..." : "Iniciar sesión"}</span>

              {!isSubmitting && (
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}

              {isSubmitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-[#00285d]/30 border-t-[#00285d]" />
              )}
            </button>
          </form>

          {/* Indicador de seguridad */}
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-5 text-xs text-[#9baec5]">
            <ShieldCheck size={16} className="text-[#4edea3]" />
            Acceso protegido a tu cuenta
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-[#718198]">
          NovaTech · Plataforma de e-commerce
        </footer>
      </section>
    </main>
  );
}
