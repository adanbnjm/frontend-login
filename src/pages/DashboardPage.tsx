import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { perfilService } from "../service/perfil";
import { PerfilModal } from "../components/PerfilModal";

function StoreMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-base font-bold text-white">
      M
    </span>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const usuarioNombre = useAuthStore((state) => state.usuarioNombre);
  const usuarioAvatar = useAuthStore((state) => state.usuarioAvatar);
  const actualizarPerfil = useAuthStore((state) => state.actualizarPerfil);

  const [isPerfilOpen, setIsPerfilOpen] = useState(false);

  useEffect(() => {
    perfilService
      .obtener()
      .then((perfil) => actualizarPerfil(perfil.name, perfil.avatar_url))
      .catch(() => {});
  }, [actualizarPerfil]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <StoreMark />
            <span className="text-lg font-bold tracking-tight">mercado</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            {usuarioAvatar ? (
              <img
                src={usuarioAvatar}
                alt="Foto de perfil"
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-800">
                {usuarioNombre
                  ? usuarioNombre.substring(0, 2).toUpperCase()
                  : "NN"}
              </span>
            )}

            <span className="hidden sm:block">
              {usuarioNombre ?? "Usuario Desconocido"}
            </span>

            <button
              className="rounded-xl bg-stone-100 px-3 py-2 font-bold hover:bg-emerald-50 hover:text-emerald-700"
              type="button"
              onClick={() => setIsPerfilOpen(true)}
            >
              Mi Perfil
            </button>

            <button
              className="text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold text-emerald-700">
            Tu cuenta
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Hola, {usuarioNombre ?? "Desconocido"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Aquí tienes un resumen de tu actividad en mercado.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-emerald-700 p-7 text-white md:col-span-2">
            <p className="text-sm font-semibold text-emerald-200">
              Compra reciente
            </p>

            <h2 className="mt-8 text-2xl font-bold">
              Tu pedido está en camino
            </h2>

            <p className="mt-2 text-sm text-emerald-100">
              Pedido #MK-2048 - Entrega estimada mañana
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-7">
            <p className="text-sm text-slate-500">Pedidos realizados</p>

            <strong className="mt-8 block text-4xl font-bold text-slate-950">
              12
            </strong>

            <p className="mt-2 text-xs font-semibold text-emerald-700">
              +2 este mes
            </p>
          </article>
        </div>
      </div>

      {isPerfilOpen && <PerfilModal onClose={() => setIsPerfilOpen(false)} />}
    </main>
  );
}
