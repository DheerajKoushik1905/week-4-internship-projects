import { Navigate, Route, Routes } from "react-router-dom";
import { createContext, useContext, useMemo, useState } from "react";
import AuthPage from "./AuthPage.jsx";
import Dashboard from "./Dashboard.jsx";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Provider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("week4_token") || "");
  const value = useMemo(() => ({
    token,
    login(next) { localStorage.setItem("week4_token", next); setToken(next); },
    logout() { localStorage.removeItem("week4_token"); setToken(""); }
  }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function Private({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Provider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Private><Dashboard /></Private>} />
      </Routes>
    </Provider>
  );
}
