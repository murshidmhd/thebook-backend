import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async () => {
    const res = await api.get("/accounts/profile/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    setUser(res.data);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");

      await api.post("/logout/", { refresh: refreshToken });

      console.log("Logged out from server");
    } catch (err) {
      console.error("Server logout failed, clearing local data anyway");
      console.log(err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
