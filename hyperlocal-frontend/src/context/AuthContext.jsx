/* src/context/AuthContext.jsx */
import { createContext, useContext, useMemo, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";
const AuthContext = createContext();

/* --------------------------------- helpers -------------------------------- */
const readLS = (k) => {
  try {
    const raw = localStorage.getItem(k);
    return raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const removeLS = (k) => localStorage.removeItem(k);

/* quick‑n‑dirty JWT decoder (no signature check, only payload JSON) */
const decodeJwt = (tok) => {
  try {
    return JSON.parse(atob(tok.split(".")[1]));
  } catch {
    // bad token or atob() fail
    return {};
  }
};

/* -------------------------------------------------------------------------- */
/*                                Provider                                    */
/* -------------------------------------------------------------------------- */
export function AuthProvider({ children }) {
  const { clearCart } = useCart?.() || {}; // ✅ Optional chaining to avoid invalid hook call
  const [user, setUser] = useState(() => readLS("user"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  /* sync axios header */
  useMemo(() => {
    if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete API.defaults.headers.common.Authorization;
  }, [token]);

  /* extractor handles both {user,token} OR { …userFields, token } */
  const pickUserAndToken = (data) => {
    if (data.user && data.token) return { user: data.user, token: data.token };
    const { token, ...user } = data;
    return { user, token };
  };

  /* make sure the returned user has .role */
  const ensureRole = (rawUser, jwtToken) => {
    if (rawUser?.role) return rawUser;
    const { role } = decodeJwt(jwtToken) || {};
    return { ...rawUser, role };
  };

  /* -------------------- auth helpers -------------------- */
  const login = async (payload) => {
    const { data } = await API.post("/auth/login", payload);
    console.log("Login response:", data);

    const { user, token } = pickUserAndToken(data);
    const userWithRole = ensureRole(user, token);

    setUser(userWithRole);
    setToken(token);

    writeLS("user", userWithRole);
    localStorage.setItem("token", token);
    clearCart?.();
  };

  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    const { user, token } = pickUserAndToken(data);
    const userWithRole = ensureRole(user, token);

    setUser(userWithRole);
    setToken(token);

    writeLS("user", userWithRole);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeLS("user");
    removeLS("token");
    clearCart?.();
  };

  /* --------------------- context value ------------------- */
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* convenience hook */
export const useAuth = () => useContext(AuthContext);
