import { API_BASE } from "@/config/api";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || "";
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = getToken();

  const res = await fetch(url, {
    method: init.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: init.body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API error:", res.status, res.statusText, text);
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return (await res.json()) as T;
}

// Endpoints per backend team
export const getUser = () => apiFetch<{
  name?: string;
  full_name?: string;
  user_id?: string;
  telephone_number?: string;
  phone_number?: string;
  email?: string;
  created_at?: string;
  birth_date?: string;
  address?: string;
}>("/user/"); // GET https://.../api/v1/user/
