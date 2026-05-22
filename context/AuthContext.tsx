"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface WPUser {
  ID?: number;
  user_login?: string;
  user_email?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  image?: string | false;
  phone?: string;
}

interface AuthState {
  user: WPUser | null;
  token: string | null;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface AuthContextValue extends AuthState {
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  sendEmailCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const WP_API = "/api/wp";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wp_auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({ user: parsed.user, token: parsed.token, isLoading: false });
        return;
      }
    } catch {
      // ignore corrupt storage
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const persistAuth = (user: WPUser, token: string) => {
    localStorage.setItem("wp_auth", JSON.stringify({ user, token }));
    setState({ user, token, isLoading: false });
  };

  const login = async (login: string, password: string) => {
    try {
      const res = await fetch(`${WP_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (data.success) {
        persistAuth(data.user, data.token);
        return { success: true };
      }
      return { success: false, error: data.error ?? "Invalid credentials." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (payload: RegisterData) => {
    try {
      const res = await fetch(`${WP_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        persistAuth(data.user, data.token);
        return { success: true };
      }
      return { success: false, error: data.error ?? "Registration failed." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const sendEmailCode = async (email: string) => {
    try {
      const res = await fetch(`${WP_API}/email-login-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const verifyEmailCode = async (email: string, code: string) => {
    try {
      const res = await fetch(`${WP_API}/email-verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        persistAuth(data.user, data.token);
        return { success: true };
      }
      return { success: false, error: data.error ?? "Invalid or expired code." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("wp_auth");
    setState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, sendEmailCode, verifyEmailCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
