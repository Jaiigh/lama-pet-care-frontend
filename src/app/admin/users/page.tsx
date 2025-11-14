"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { environment } from "@/env/environment";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

type Role = "Owner" | "Caretaker" | "Doctor";

type AdminUser = {
  id: string;
  userId: string;
  name: string;
  role: Role;
  createdAt: string;
};

type CreateFormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  address: string;
  role: Role;
  license: string;
  specialization: string;
};

type ApiError = Error & { code?: number };

const API_BASE = environment.masterUrl;
const PAGE_SIZE = 20;

const roleStyles: Record<Role, string> = {
  Owner: "bg-sky-50 text-sky-700",
  Caretaker: "bg-emerald-50 text-emerald-700",
  Doctor: "bg-amber-50 text-amber-700",
};

const roleTabs: (Role | "ทั้งหมด")[] = ["ทั้งหมด", "Owner", "Caretaker", "Doctor"];

const initialCreateForm: CreateFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  birthDate: "",
  address: "",
  role: "Owner",
  license: "",
  specialization: "",
};

const fallbackUsers: AdminUser[] = [
  { id: "112", userId: "fallback-112", name: "Rammy Sakonakorn", role: "Owner", createdAt: "2025-10-12" },
  { id: "219", userId: "fallback-219", name: "Napa Sirirak", role: "Caretaker", createdAt: "2025-09-02" },
  { id: "337", userId: "fallback-337", name: "Dr. Patchara Wong", role: "Doctor", createdAt: "2025-07-18" },
  { id: "441", userId: "fallback-441", name: "Thanapol K.", role: "Owner", createdAt: "2025-11-20" },
  { id: "509", userId: "fallback-509", name: "Anya Charoensuk", role: "Owner", createdAt: "2025-06-05" },
  { id: "612", userId: "fallback-612", name: "Dr. Wirat Maneenop", role: "Doctor", createdAt: "2024-12-22" },
  { id: "718", userId: "fallback-718", name: "Mookda Pasit", role: "Caretaker", createdAt: "2025-01-14" },
  { id: "845", userId: "fallback-845", name: "Sirikorn L.", role: "Owner", createdAt: "2025-03-08" },
  { id: "902", userId: "fallback-902", name: "Dr. Krit Jirasak", role: "Doctor", createdAt: "2024-11-02" },
  { id: "978", userId: "fallback-978", name: "Patcha Noon", role: "Caretaker", createdAt: "2025-02-19" },
  { id: "1015", userId: "fallback-1015", name: "Warin K.", role: "Owner", createdAt: "2025-05-25" },
  { id: "1113", userId: "fallback-1113", name: "Dr. Chawin Song", role: "Doctor", createdAt: "2024-09-30" },
  { id: "1268", userId: "fallback-1268", name: "Natnicha J.", role: "Owner", createdAt: "2025-04-02" },
];

export default function UsersPage() {
  const { token, profile: adminProfile, loading: sessionLoading } = useAdminSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<Role | "ทั้งหมด">("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [ownerTotal, setOwnerTotal] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(initialCreateForm);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const authorizedFetch = useCallback(
    (path: string, init?: RequestInit) => {
      if (!token) {
        throw new Error("Missing admin token");
      }
      const headers = new Headers(init?.headers ?? {});
      if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      headers.set("Authorization", `Bearer ${token}`);
      return fetch(`${API_BASE}${path}`, {
        ...init,
        headers,
        cache: "no-store",
      });
    },
    [token],
  );

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const aggregated: AdminUser[] = [];
      let owners = 0;
      let currentPage = 1;

      while (true) {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_SIZE),
        });
        const response = await authorizedFetch(`/admin/users?${params.toString()}`);
        if (!response.ok) {
          throw createApiError(
            response.status === 401
              ? "สิทธิ์ของผู้ดูแลหมดอายุหรือไม่ถูกต้อง"
              : "ไม่สามารถโหลดข้อมูลผู้ใช้จาก API ได้",
            response.status,
          );
        }

        const json = await response.json();
        const normalized = normalizeUserCollection(json?.data ?? json);
        const withoutCurrent =
          adminProfile?.userId != null
            ? normalized.filter((user) => user.userId !== adminProfile.userId)
            : normalized;

        aggregated.push(...withoutCurrent);
        owners += withoutCurrent.filter((user) => user.role === "Owner").length;

        if (normalized.length < PAGE_SIZE) {
          break;
        }
        currentPage += 1;
      }

      setUsers(aggregated);
      setTotalUsers(aggregated.length);
      setOwnerTotal(owners);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลผู้ใช้จากระบบได้",
      );
      setUsers(fallbackUsers);
      setTotalUsers(fallbackUsers.length);
      setOwnerTotal(fallbackUsers.filter((user) => user.role === "Owner").length);
    } finally {
      setLoading(false);
    }
  }, [adminProfile?.userId, authorizedFetch, token]);

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [loadUsers, token]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  const filteredUsers = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchRole = roleFilter === "ทั้งหมด" || user.role === roleFilter;
      const matchSearch =
        trimmed.length === 0 ||
        user.id.toLowerCase().includes(trimmed) ||
        user.name.toLowerCase().includes(trimmed);
      return matchRole && matchSearch;
    });
  }, [roleFilter, searchTerm, users]);

  const totalPages =
    filteredUsers.length === 0
      ? 1
      : Math.ceil(filteredUsers.length / PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE,
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const changePage = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      }
      return Math.min(totalPages, prev + 1);
    });
  };

  const handleCreateChange = (field: keyof CreateFormState, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setErrorMessage(null);
    try {
      const payload: Record<string, unknown> = {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        address: createForm.address,
        telephone_number: createForm.phone,
      };

      if (createForm.birthDate) {
        const isoDate = new Date(createForm.birthDate).toISOString();
        payload.birth_date = isoDate;
      }
      if (createForm.role === "Caretaker" && createForm.specialization) {
        payload.specialization = createForm.specialization;
      }
      if (createForm.role === "Doctor" && createForm.license) {
        payload.license_number = createForm.license;
      }

      const response = await fetch(
        `${API_BASE}/auth/register/${createForm.role.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw createApiError(message ?? "ไม่สามารถสร้างผู้ใช้ได้", response.status);
      }

      setCreateOpen(false);
      setCreateForm(initialCreateForm);
      if (token) {
        await loadUsers();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "สร้างผู้ใช้ไม่สำเร็จ";
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!pendingDelete || !token) return;
    setDeleting(true);
    setErrorMessage(null);
    try {
      const response = await authorizedFetch(
        `/admin/users/${encodeURIComponent(pendingDelete.userId)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw createApiError("ลบผู้ใช้ไม่สำเร็จ", response.status);
      }
      setPendingDelete(null);
      await loadUsers();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "ลบผู้ใช้ไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell title="Users" description="จัดการรายชื่อผู้ใช้งานและสิทธิการเข้าถึงระบบ">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading || sessionLoading
              ? "—"
              : totalUsers ?? filteredUsers.length}
          </p>
          <p className="text-xs text-slate-400">จำนวนผู้ใช้ทั้งหมด</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เจ้าของสัตว์เลี้ยง</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading || sessionLoading
              ? "—"
              : ownerTotal ?? filteredUsers.filter((u) => u.role === "Owner").length}
          </p>
          <p className="text-xs text-slate-400">Owner ที่ลงทะเบียน</p>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">รายชื่อผู้ใช้</h2>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-[#D89B76] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#c8865d]"
          >
            + เพิ่มผู้ใช้
          </button>
        </div>

        <div className="space-y-2 transition duration-300 ease-out">
          <div className="relative grid grid-cols-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50 p-1 text-sm font-medium text-slate-600">
            <span
              className="pointer-events-none absolute inset-y-1 w-1/4 rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${roleTabs.indexOf(roleFilter) * 100}%)` }}
            />
            {roleTabs.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role as Role | "ทั้งหมด")}
                className={`relative z-10 rounded-xl px-4 py-2 transition ${
                  roleFilter === role
                    ? "text-emerald-700"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="ค้นหาด้วยหมายเลขสมาชิกหรือชื่อ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-shadow duration-200 focus:shadow-lg"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 space-y-3 transition-all duration-300 ease-out">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <article
                key={`skeleton-${idx}`}
                className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-6 py-4 shadow-sm animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div className="min-w-[120px] space-y-2">
                  <div className="h-3 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-16 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-4 w-32 rounded-full bg-slate-300" />
                </div>
                <div className="min-w-[140px] space-y-2">
                  <div className="h-3 w-16 rounded-full bg-slate-200" />
                  <div className="h-4 w-14 rounded-full bg-slate-300" />
                </div>
                <div className="min-w-[140px] space-y-2">
                  <div className="h-3 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-24 rounded-full bg-slate-300" />
                </div>
              </article>
            ))
          ) : filteredUsers.length > 0 ? (
            pageUsers.map((user) => (
              <article
                key={`${user.userId}-${user.id}`}
                className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 px-6 py-4 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-base font-semibold text-emerald-600">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="min-w-[120px]">
                  <p className="text-xs font-semibold text-slate-500">หมายเลขสมาชิก</p>
                  <p className="text-lg font-semibold text-emerald-600">{user.id}</p>
                </div>
                <div className="min-w-[180px] flex-1">
                  <p className="text-xs font-semibold text-slate-500">ชื่อ</p>
                  <p className="text-lg font-semibold text-emerald-700">{user.name}</p>
                </div>
                <div className="flex flex-col min-w-[140px]">
                  <p className="text-xs font-semibold text-slate-500">ประเภท</p>
                  <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex flex-col min-w-[140px]">
                  <p className="text-xs font-semibold text-slate-500">สร้างเมื่อ</p>
                  <p className="text-lg font-semibold text-slate-900">{user.createdAt}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link
                    aria-label={`แก้ไข ${user.name}`}
                    href={`/admin/users/${user.userId}/edit`}
                    className="rounded-full bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    aria-label={`ลบ ${user.name}`}
                    onClick={() => setPendingDelete(user)}
                    className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-3xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
              ไม่พบข้อมูลผู้ใช้ที่ตรงกับเงื่อนไข
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            หน้า {page} / {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1 || loading}
              onClick={() => changePage("prev")}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading || filteredUsers.length === 0}
              onClick={() => changePage("next")}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-900">เพิ่มผู้ใช้ใหม่</h3>
            {createError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {createError}
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                ชื่อ
                <input
                  required
                  value={createForm.name}
                  onChange={(e) => handleCreateChange("name", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                อีเมล
                <input
                  required
                  type="email"
                  value={createForm.email}
                  onChange={(e) => handleCreateChange("email", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                รหัสผ่าน
                <input
                  required
                  type="password"
                  value={createForm.password}
                  onChange={(e) => handleCreateChange("password", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                หมายเลขโทรศัพท์
                <input
                  required
                  value={createForm.phone}
                  onChange={(e) => handleCreateChange("phone", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                วันที่เกิด
                <input
                  required
                  type="date"
                  value={createForm.birthDate}
                  onChange={(e) => handleCreateChange("birthDate", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                ที่อยู่
                <input
                  required
                  value={createForm.address}
                  onChange={(e) => handleCreateChange("address", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                บทบาท
                <select
                  value={createForm.role}
                  onChange={(e) => handleCreateChange("role", e.target.value as Role)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="Owner">Owner</option>
                  <option value="Caretaker">Caretaker</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </label>
              {createForm.role === "Doctor" && (
                <label className="text-sm text-slate-600">
                  License Number
                  <input
                    value={createForm.license}
                    onChange={(e) => handleCreateChange("license", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              )}
              {createForm.role === "Caretaker" && (
                <label className="text-sm text-slate-600">
                  Specialization
                  <input
                    value={createForm.specialization}
                    onChange={(e) =>
                      handleCreateChange("specialization", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {createLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">ยืนยันการลบผู้ใช้</h3>
            <p className="mt-2 text-sm text-slate-600">
              ต้องการลบผู้ใช้{" "}
              <span className="font-semibold text-emerald-700">{pendingDelete.name}</span>{" "}
              หรือไม่? การลบนี้ไม่สามารถกู้คืนได้
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUser}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "กำลังลบ..." : "ยืนยันการลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function normalizeUserCollection(payload: unknown): AdminUser[] {
  const collection = toRawUserArray(payload);
  return collection.map((entry, index) => ({
    id:
      getFirstString(entry, ["show_id", "showId", "member_id", "memberId"]) ??
      String(index + 1),
    userId:
      getFirstString(entry, ["user_id", "userId", "id"]) ??
      `user-${index}`,
    name: getFirstString(entry, ["name", "Name", "full_name", "email"]) ?? "ไม่ทราบชื่อ",
    role: mapRole(getFirstString(entry, ["role", "Role"])),
    createdAt: formatDate(
      getFirstString(entry, ["created_at", "createdAt", "CreatedAt"]),
    ),
  }));
}

type RawUserRecord = Record<string, unknown>;

function toRawUserArray(payload: unknown): RawUserRecord[] {
  if (Array.isArray(payload)) return payload as RawUserRecord[];
  if (payload && typeof payload === "object") {
    const obj = payload as { users?: unknown; data?: unknown };
    if (Array.isArray(obj.users)) return obj.users as RawUserRecord[];
    if (Array.isArray(obj.data)) return obj.data as RawUserRecord[];
  }
  return [];
}

function getFirstString(record: RawUserRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
  }
  return undefined;
}

function mapRole(value?: string): Role {
  switch ((value ?? "").toLowerCase()) {
    case "caretaker":
      return "Caretaker";
    case "doctor":
      return "Doctor";
    default:
      return "Owner";
  }
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
}

function createApiError(message: string, code?: number): ApiError {
  const error = new Error(message) as ApiError;
  if (code) error.code = code;
  return error;
}

async function extractErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    return null;
  } catch {
    return null;
  }
}
