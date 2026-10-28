import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [errorServidor, setErrorServidor] = useState("");

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
        "No se pudo iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-emerald-600 text-2xl font-bold">
            M
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Mercado</h1>

          <p className="mt-2 text-sm text-slate-400">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              {...register("email", {
                required: "El correo es obligatorio",
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-rose-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-rose-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {errorServidor && (
            <p
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
            >
              {errorServidor}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Mercado · Acceso seguro
        </p>
      </section>
    </main>
  );
}
