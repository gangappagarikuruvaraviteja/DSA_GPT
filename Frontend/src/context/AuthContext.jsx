import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("token");
    if (u && t) {
      setUser(u);
      setToken(t);
    }
  }, []);

  const login = (email, token) => {
    localStorage.setItem("user", email);
    localStorage.setItem("token", token);
    setUser(email);
    setToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
