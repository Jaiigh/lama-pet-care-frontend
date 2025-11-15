"use client";

import { environment } from "@/env/environment";

const API_BASE = environment.masterUrl;

function ensureApiBase() {
  if (!API_BASE) {
    throw new Error("API base URL is not configured");
  }
  return API_BASE;
}

async function toJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function buildError(response: Response, fallback: string) {
  const data = await toJson(response);
  const message = typeof data?.message === "string" ? data.message : fallback;
  const error = new Error(message);
  (error as { code?: number }).code = response.status;
  return error;
}

export async function adminLogin(email: string, password: string): Promise<string> {
  const response = await fetch(`${ensureApiBase()}/auth/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw await buildError(response, "เข้าสู่ระบบผู้ดูแลไม่สำเร็จ");
  }
  const data = await toJson(response);
  if (typeof data === "string") return data;
  if (typeof data?.data === "string") return data.data;
  if (typeof data?.data?.token === "string") return data.data.token;
  if (typeof data?.data?.Token === "string") return data.data.Token;
  throw new Error("ไม่พบ token จากเซิร์ฟเวอร์");
}

export async function fetchAdminProfile(token: string) {
  const response = await fetch(`${ensureApiBase()}/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw await buildError(response, "โหลดข้อมูลผู้ดูแลไม่สำเร็จ");
  }
  const json = await toJson(response);
  return json?.data ?? json;
}

export async function fetchAdminUsers(
  token: string,
  params: { page?: number; limit?: number; role?: string } = {},
) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.role) search.set("role", params.role);

  const response = await fetch(`${ensureApiBase()}/admin/users?${search.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw await buildError(response, "ไม่สามารถโหลดข้อมูลผู้ใช้จาก API ได้");
  }
  const json = await toJson(response);
  return json?.data ?? json;
}

export async function deleteUserByAdmin(token: string, userId: string) {
  const response = await fetch(`${ensureApiBase()}/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw await buildError(response, "ลบผู้ใช้ไม่สำเร็จ");
  }
  return toJson(response);
}

export async function registerUser(role: string, payload: Record<string, unknown>) {
  const response = await fetch(`${ensureApiBase()}/auth/register/${role}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw await buildError(response, "ไม่สามารถสร้างผู้ใช้ได้");
  }
  return toJson(response);
}
