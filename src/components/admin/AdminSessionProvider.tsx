"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { adminLogin, fetchAdminProfile } from "@/services/adminApi";

type AdminProfile = {
  userId: string;
  name: string;
  email: string;
};

type AdminSessionValue = {
  token: string | null;
  profile: AdminProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ADMIN_TOKEN_KEY = "lama_admin_session_token";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "a112@gmail.com";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "a112";

const AdminSessionContext = createContext<AdminSessionValue | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    try {
      let storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!storedToken) {
        storedToken = await adminLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
        localStorage.setItem(ADMIN_TOKEN_KEY, storedToken);
      }
      const adminProfile = await fetchAdminProfile(storedToken);
      setToken(storedToken);
      setProfile(adminProfile);
      setError(null);
    } catch (err) {
      console.error("Admin session error:", err);
      setToken(null);
      setProfile(null);
      setError(
        err instanceof Error ? err.message : "ไม่สามารถเชื่อมต่อผู้ดูแลระบบได้",
      );
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    refresh();
  }, [refresh]);

  const value = useMemo<AdminSessionValue>(
    () => ({
      token,
      profile,
      loading,
      error,
      refresh,
    }),
    [token, profile, loading, error, refresh],
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return context;
}
