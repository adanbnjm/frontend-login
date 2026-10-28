import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const autenticado = useAuthStore((state) => state.autenticado);

  return (
    <Routes>
      <Route
        path="/login"
        element={autenticado ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          autenticado ? <DashboardPage /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/perfil"
        element={
          autenticado ? <PerfilPage /> : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
