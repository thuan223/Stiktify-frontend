"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { sendRequest } from "@/utils/api";

interface AuthContextType {
  accessToken: string | null;
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = (token: string) => {
    setAccessToken(token);
    console.log("token >>>", token);
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/getUser`,
          method: "POST",
          body: {
            token: accessToken,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        logout();
      }
    };

    fetchUser();
  }, [accessToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
