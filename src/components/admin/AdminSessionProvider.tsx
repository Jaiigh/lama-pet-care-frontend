"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { environment } from "@/env/environment";

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

const API_BASE = environment.masterUrl;
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
        storedToken = await loginAdmin();
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

async function loginAdmin(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("เข้าสู่ระบบผู้ดูแลไม่สำเร็จ");
  }
  const json = await response.json();
  const data = json?.data;
  if (typeof data === "string") return data;
  if (typeof data?.token === "string") return data.token;
  if (typeof data?.Token === "string") return data.Token;
  throw new Error("เซิร์ฟเวอร์ไม่ส่ง token สำหรับผู้ดูแลระบบ");
}

async function fetchAdminProfile(token: string): Promise<AdminProfile> {
  const response = await fetch(`${API_BASE}/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("โหลดข้อมูลผู้ดูแลไม่สำเร็จ");
  }
  const json = await response.json();
  const data = json?.data ?? json;
  return {
    userId: data?.user_id ?? data?.id ?? "",
    name: data?.name ?? "Admin",
    email: data?.email ?? "",
  };
}
