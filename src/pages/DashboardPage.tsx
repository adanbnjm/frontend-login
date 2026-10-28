import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { perfilService } from "../service/perfil";
import { usuariosService, type Usuario } from "../service/usuarios";

function StoreMark() {
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-950/40">
      🤖
    </div>
  );
}

function Avatar({
  nombre,
  foto,
  grande = false,
}: {
  nombre: string;
  foto?: string | null;
  grande?: boolean;
}) {
  const iniciales =
    nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase() || "U";

  return foto ? (
    <img
      src={foto}
      alt={`Avatar de ${nombre}`}
      className={`${grande ? "size-11" : "size-10"} shrink-0 rounded-full border border-slate-700 object-cover`}
    />
  ) : (
    <div
      className={`${grande ? "size-11" : "size-10"} grid shrink-0 place-items-center rounded-full border border-blue-400/20 bg-blue-500/15 font-bold text-blue-300`}
    >
      {iniciales}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const usuarioNombre = useAuthStore((state) => state.usuarioNombre);
  const usuarioAvatar = useAuthStore((state) => state.usuarioAvatar);
  const actualizarPerfil = useAuthStore((state) => state.actualizarPerfil);
  const esAdmin = useAuthStore((state) => state.esAdmin);

  const admin = esAdmin();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");

  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    perfilService
      .obtener()
      .then((perfil) => {
        actualizarPerfil(perfil.name, perfil.avatar_url);
      })
      .catch(() => {
        // Si falla la consulta, conservamos los datos de la sesión.
      });
  }, [actualizarPerfil]);

  useEffect(() => {
    if (!admin) {
      setUsuarios([]);
      return;
    }

    let activo = true;

    async function cargarUsuarios() {
      setCargandoUsuarios(true);
      setErrorUsuarios("");

      try {
        const datos = await usuariosService.listar();

        if (activo) {
          setUsuarios(datos);
        }
      } catch {
        if (activo) {
          setErrorUsuarios(
            "No se pudo cargar la lista. Comprueba tu conexión e inténtalo de nuevo.",
          );
        }
      } finally {
        if (activo) {
          setCargandoUsuarios(false);
        }
      }
    }

    void cargarUsuarios();

    return () => {
      activo = false;
    };
  }, [admin]);

  const roles = useMemo(
    () => [...new Set(usuarios.map((usuario) => usuario.role))].sort(),
    [usuarios],
  );

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const coincideBusqueda =
        usuario.name.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino);

      const coincideRol = filtroRol === "TODOS" || usuario.role === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#080E1B] text-slate-100">
      {/* Menú lateral para escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-[#0D1627] lg:flex">
        <div className="flex h-[84px] items-center gap-3 border-b border-slate-800 px-6">
          <StoreMark />
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Novatech
            </p>
            <p className="text-xs text-slate-500">Panel de gestión</p>
          </div>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            MENÚ PRINCIPAL
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl bg-blue-500/15 px-4 py-3 text-left text-sm font-semibold text-blue-300 ring-1 ring-inset ring-blue-400/10 transition hover:bg-blue-500/20"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {admin && (
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("gestion-usuarios")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <Users size={19} />
              Usuarios
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <UserRound size={19} />
            Mi perfil
          </button>
        </div>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900/70 p-3">
            <Avatar nombre={usuarioNombre ?? "Usuario"} foto={usuarioAvatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {usuarioNombre ?? "Usuario"}
              </p>
              <p className="text-xs text-slate-500">
                {admin ? "Administrador" : "Cliente"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Menú móvil */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuMovilAbierto(false)}
            className="absolute inset-0 bg-black/70"
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-slate-800 bg-[#0D1627]">
            <div className="flex h-[84px] items-center justify-between border-b border-slate-800 px-5">
              <div className="flex items-center gap-3">
                <StoreMark />
                <span className="font-bold text-white">NovaTech</span>
              </div>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMenuMovilAbierto(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 p-4">
              <button
                type="button"
                onClick={() => {
                  setMenuMovilAbierto(false);
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-blue-500/15 px-4 py-3 text-sm text-blue-300"
              >
                <LayoutDashboard size={19} />
                Dashboard
              </button>

              {admin && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuMovilAbierto(false);
                    document
                      .getElementById("gestion-usuarios")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                >
                  <Users size={19} />
                  Usuarios
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuMovilAbierto(false);
                  navigate("/perfil");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
              >
                <UserRound size={19} />
                Mi perfil
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut size={19} />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[84px] items-center justify-between border-b border-slate-800 bg-[#080E1B]/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMenuMovilAbierto(true)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs text-slate-500">NovaTech / Panel</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                {admin ? "Administración" : "Mi cuenta"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 sm:flex">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Sesión activa
              </span>
            </div>

            <button
              type="button"
              aria-label="Abrir mi perfil"
              onClick={() => navigate("/perfil")}
              className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <Bell size={20} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition hover:bg-slate-800"
            >
              <Avatar
                nombre={usuarioNombre ?? "Usuario"}
                foto={usuarioAvatar}
                grande
              />
              <div className="hidden text-left sm:block">
                <p className="max-w-36 truncate text-sm font-semibold text-white">
                  {usuarioNombre ?? "Usuario"}
                </p>
                <p className="text-xs text-slate-500">
                  {admin ? "ADMIN" : "CLIENTE"}
                </p>
              </div>
              <ChevronDown
                size={15}
                className="hidden text-slate-500 sm:block"
              />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-8 sm:px-8 sm:py-10">
          {/* Bienvenida */}
          <section>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-blue-400">
              {admin ? <ShieldCheck size={15} /> : <UserRound size={15} />}
              {admin ? "PANEL DE ADMINISTRACIÓN" : "TU ESPACIO PERSONAL"}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hola, {usuarioNombre ?? "Usuario"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              {admin
                ? "Gestiona las cuentas registradas y supervisa los usuarios de NovaTech."
                : "Bienvenido a tu cuenta. Puedes consultar y actualizar tu información personal."}
            </p>
          </section>

          {/* Resumen */}
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-[#111D30] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Estado de tu cuenta</p>
                  <p className="mt-3 text-xl font-bold text-white">
                    Sesión activa
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={24} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Has iniciado sesión correctamente.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#111D30] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Tu perfil</p>
                  <p className="mt-3 text-xl font-bold text-white">
                    {usuarioNombre ?? "Usuario"}
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                  <UserRound size={24} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuMovilAbierto(false);
                  navigate("/perfil");
                }}
                className="mt-3 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Editar mi perfil →
              </button>
            </article>
          </section>

          {/* Gestión de usuarios: solo ADMIN */}
          {admin && (
            <section
              id="gestion-usuarios"
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-800 bg-[#0D1627]"
            >
              <div className="border-b border-slate-800 p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-blue-400">
                      CONTROL DE ACCESO
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Gestión de usuarios
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Consulta las cuentas registradas en la plataforma.
                    </p>
                  </div>

                  <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-[#080E1B] px-3 focus-within:border-blue-500 xl:w-80">
                    <Search size={18} className="shrink-0 text-slate-500" />
                    <input
                      type="search"
                      value={busqueda}
                      onChange={(event) => setBusqueda(event.target.value)}
                      placeholder="Buscar por nombre o correo..."
                      aria-label="Buscar usuarios por nombre o correo"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users size={17} />
                    <span>
                      {usuariosFiltrados.length}{" "}
                      {usuariosFiltrados.length === 1
                        ? "usuario encontrado"
                        : "usuarios encontrados"}
                    </span>
                  </div>

                  <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-700 bg-[#080E1B] px-3 text-sm text-slate-300">
                    <span className="text-slate-500">Rol:</span>
                    <select
                      value={filtroRol}
                      onChange={(event) => setFiltroRol(event.target.value)}
                      className="max-w-36 bg-transparent text-sm text-white outline-none"
                    >
                      <option value="TODOS" className="bg-slate-900">
                        Todos los roles
                      </option>
                      {roles.map((rol) => (
                        <option key={rol} value={rol} className="bg-slate-900">
                          {rol}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {cargandoUsuarios ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-slate-400">
                  <LoaderCircle
                    size={30}
                    className="animate-spin text-blue-400"
                  />
                  <p className="text-sm">Cargando usuarios...</p>
                </div>
              ) : errorUsuarios ? (
                <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                  <AlertCircle size={32} className="text-rose-400" />
                  <p className="max-w-md text-sm text-rose-300">
                    {errorUsuarios}
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <RefreshCw size={16} />
                    Volver a cargar
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#111D30]/70 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Usuario</th>
                        <th className="px-6 py-4 font-semibold">
                          Correo electrónico
                        </th>
                        <th className="px-6 py-4 font-semibold">Rol</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/80">
                      {usuariosFiltrados.map((usuario) => (
                        <tr
                          key={usuario.id}
                          className="transition hover:bg-blue-500/[0.04]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar
                                nombre={usuario.name}
                                foto={usuario.avatar_url}
                              />
                              <div>
                                <p className="font-semibold text-slate-100">
                                  {usuario.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  ID: {usuario.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {usuario.email}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                usuario.role.toUpperCase() === "ADMIN"
                                  ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
                                  : usuario.role.toUpperCase() === "CLIENTE"
                                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                    : "border-slate-600 bg-slate-800 text-slate-300"
                              }`}
                            >
                              {usuario.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {usuariosFiltrados.length === 0 && (
                    <div className="px-6 py-14 text-center">
                      <Search
                        size={30}
                        className="mx-auto mb-3 text-slate-600"
                      />
                      <p className="font-medium text-slate-300">
                        No se encontraron usuarios
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Prueba con otro nombre, correo o rol.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-slate-800 px-5 py-4 sm:px-7">
                <p className="text-xs text-slate-500">
                  Los datos de esta tabla proceden de la API de Mercado.
                </p>
              </div>
            </section>
          )}

          <footer className="border-t border-slate-800 pt-6 text-center text-xs text-slate-600 sm:text-left">
            NovaTech · Panel de gestión de cuentas
          </footer>
        </div>
      </div>
    </main>
  );
}
