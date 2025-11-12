"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

type Role = "Owner" | "Caretaker" | "Doctor";

type AdminUser = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
  petCount: number;
};

const mockUsers: AdminUser[] = [
  {
    id: "112",
    name: "Rammy Sakonakorn",
    role: "Owner",
    createdAt: "2025-10-12",
    petCount: 3,
  },
  {
    id: "219",
    name: "Napa Sirirak",
    role: "Caretaker",
    createdAt: "2025-09-02",
    petCount: 0,
  },
  {
    id: "337",
    name: "Dr. Patchara Wong",
    role: "Doctor",
    createdAt: "2025-07-18",
    petCount: 0,
  },
  {
    id: "441",
    name: "Thanapol K.",
    role: "Owner",
    createdAt: "2025-11-20",
    petCount: 2,
  },
  {
    id: "509",
    name: "Anya Charoensuk",
    role: "Owner",
    createdAt: "2025-06-05",
    petCount: 1,
  },
  {
    id: "612",
    name: "Dr. Wirat Maneenop",
    role: "Doctor",
    createdAt: "2024-12-22",
    petCount: 0,
  },
  {
    id: "718",
    name: "Mookda Pasit",
    role: "Caretaker",
    createdAt: "2025-01-14",
    petCount: 0,
  },
  {
    id: "845",
    name: "Sirikorn L.",
    role: "Owner",
    createdAt: "2025-03-08",
    petCount: 4,
  },
  {
    id: "902",
    name: "Dr. Krit Jirasak",
    role: "Doctor",
    createdAt: "2024-11-02",
    petCount: 0,
  },
  {
    id: "978",
    name: "Patcha Noon",
    role: "Caretaker",
    createdAt: "2025-02-19",
    petCount: 0,
  },
  {
    id: "1015",
    name: "Warin K.",
    role: "Owner",
    createdAt: "2025-05-25",
    petCount: 1,
  },
  {
    id: "1113",
    name: "Dr. Chawin Song",
    role: "Doctor",
    createdAt: "2024-09-30",
    petCount: 0,
  },
  {
    id: "1268",
    name: "Natnicha J.",
    role: "Owner",
    createdAt: "2025-04-02",
    petCount: 2,
  },
  
  // ----------- API GET ALL USER --------------
];

const roleStyles: Record<Role, string> = {
  Owner: "bg-sky-50 text-sky-700",
  Caretaker: "bg-emerald-50 text-emerald-700",
  Doctor: "bg-amber-50 text-amber-700",
};

const roleTabs: (Role | "ทั้งหมด")[] = ["ทั้งหมด", "Owner", "Caretaker", "Doctor"];

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [roleFilter, setRoleFilter] = useState<Role | "ทั้งหมด">("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;
    async function hydrate() {
      try {
        setLoading(true);
        // TODO: Replace with real API: const res = await fetch("/api/admin/users");
        if (active) setUsers(mockUsers);
      } finally {
        if (active) setLoading(false);
      }
    }
    hydrate();
    return () => {
      active = false;
    };
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleConfirmDelete = () => {
    // TODO: replace with API call to delete user
    if (pendingDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== pendingDelete.id));
    }
    setPendingDelete(null);
  };

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
  }, [users, roleFilter, searchTerm]);

  return (
    <AdminShell title="Users" description="จัดการรายชื่อผู้ใช้งานและสิทธิการเข้าถึงระบบ">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? "—" : users.length}
          </p>
          <p className="text-xs text-slate-400">จำนวนผู้ใช้ทั้งหมด</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เจ้าของสัตว์เลี้ยง</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? "—" : users.filter((u) => u.role === "Owner").length}
          </p>
          <p className="text-xs text-slate-400">Owner ที่ลงทะเบียน</p>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">รายชื่อผู้ใช้</h2>
          </div>
          {/* <button className="rounded-xl bg-[#D89B76] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#c8865d]">
            + เพิ่มผู้ใช้
          </button> */}
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

        <div className="mt-6 space-y-3 transition-all duration-300 ease-out">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <article
                key={`skeleton-${idx}`}
                className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-6 py-4 shadow-sm animate-pulse"
              >
                <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
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
            filteredUsers.map((user) => (
              <article
                key={user.id}
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
                    href={`/admin/users/${user.id}/edit`}
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
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">ยืนยันการลบผู้ใช้</h3>
            <p className="mt-2 text-sm text-slate-600">
              ต้องการลบผู้ใช้ <span className="font-semibold text-emerald-700">{pendingDelete.name}</span> หรือไม่? การลบนี้ไม่สามารถกู้คืนได้
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
