import { API_BASE } from "@/config/api";

function getToken(): string {
  if (typeof window === "undefined") return "";
  // Support both keys to be backward-compatible
  return (
    localStorage.getItem("accessToken") || localStorage.getItem("token") || ""
  );
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

  // Debug logs for easier diagnosis (safe to keep in dev/preview)
  try {
    // Avoid logging full token; show only prefix
    const masked = token ? `${token.slice(0, 8)}…` : "<empty>";
    console.log("apiFetch →", { url, auth: token ? `Bearer ${masked}` : "none" });
  } catch {}

  // Handle auth failures: clear token and redirect to login on client
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      console.warn("หมดเวลาเข้าสู่ระบบ กรุณา login ใหม่");
      alert("หมดเวลาเข้าสู่ระบบ กรุณา login ใหม่");
      window.location.href = "/auth/login";
    }
  }

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
