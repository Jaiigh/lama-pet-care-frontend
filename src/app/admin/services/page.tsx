"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  deleteAdminService as apiDeleteAdminService,
  fetchAdminServices as apiFetchAdminServices,
  fetchOwnerNamesMap,
  fetchPetNamesMap,
  fetchStaffNamesMap,
  normalizeServiceCollection,
  AdminService,
} from "@/services/adminServiceApi";

type ServiceStatus = "wait" | "ongoing" | "finish";

const PAGE_SIZE = 20;

const statusStyles: Record<ServiceStatus, string> = {
  wait: "bg-yellow-50 text-yellow-700",
  ongoing: "bg-blue-50 text-blue-700",
  finish: "bg-green-50 text-green-700",
};

const statusLabels: Record<ServiceStatus, string> = {
  wait: "รอดำเนินการ",
  ongoing: "กำลังดำเนินการ",
  finish: "เสร็จสิ้น",
};

const statusTabs: (ServiceStatus | "ทั้งหมด")[] = [
  "ทั้งหมด",
  "wait",
  "ongoing",
  "finish",
];

const fallbackServices: AdminService[] = [
  {
    id: "1",
    show_id: "1",
    owner_id: "UID123",
    pet_id: "pet-1",
    staff_id: "staff-1",
    reserve_date_start: "2025-11-20",
    reserve_date_end: "2025-11-27",
    service_type: "mservice",
    comment: "รักษาแล้วหายดี",
    score: 5,
    status: "finish",
    created_at: "2025-11-10",
    owner_name: "Rammy Sakonakorn",
    pet_name: "Max",
    staff_name: "Dr. John Doe",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "ทั้งหมด">(
    "ทั้งหมด"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalServices, setTotalServices] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState({
    wait: 0,
    ongoing: 0,
    finish: 0,
  });
  const [pendingDelete, setPendingDelete] = useState<AdminService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setErrorMessage("ไม่พบ token สำหรับการยืนยันตัวตน");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const aggregated: AdminService[] = [];
      let currentPage = 1;

      while (true) {
        console.log("Fetching page:", currentPage);
        const json = await apiFetchAdminServices(token, {
          page: currentPage,
          limit: PAGE_SIZE,
        });

        console.log("Raw response:", json);
        const normalized = normalizeServiceCollection(json);
        console.log("Normalized services:", normalized.length, normalized);

        aggregated.push(...normalized);

        if (normalized.length < PAGE_SIZE) {
          break;
        }
        currentPage += 1;
      }

      console.log("Total aggregated services:", aggregated.length);

      // Enrich owner, pet, and staff names
      const ownerIds = Array.from(
        new Set(aggregated.map((s) => s.owner_id).filter(Boolean))
      );
      const petIds = Array.from(
        new Set(aggregated.map((s) => s.pet_id).filter(Boolean))
      );
      const staffIds = Array.from(
        new Set(aggregated.map((s) => s.staff_id).filter(Boolean))
      );
      // Create petIdToOwnerIdMap for efficient pet fetching
      const petIdToOwnerIdMap: Record<string, string> = {};
      aggregated.forEach((s) => {
        if (s.pet_id && s.owner_id) {
          petIdToOwnerIdMap[s.pet_id] = s.owner_id;
        }
      });

      const [ownerMap, petMap, staffMap] = await Promise.all([
        fetchOwnerNamesMap(token, ownerIds),
        fetchPetNamesMap(token, petIds, petIdToOwnerIdMap),
        fetchStaffNamesMap(token, staffIds),
      ]);
      const enriched = aggregated.map((s) => ({
        ...s,
        owner_name: ownerMap[s.owner_id] ?? s.owner_name ?? "Unknown",
        pet_name: petMap[s.pet_id] ?? s.pet_name ?? "Unknown",
        staff_name: staffMap[s.staff_id] ?? s.staff_name ?? "Unknown",
      }));

      setServices(enriched);
      setTotalServices(enriched.length);

      // Calculate status counts
      const counts = { wait: 0, ongoing: 0, finish: 0 };
      enriched.forEach((service) => {
        counts[service.status]++;
      });
      setStatusCounts(counts);
    } catch (err) {
      console.error("Error loading services:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "ไม่สามารถโหลดข้อมูลบริการจากระบบได้"
      );
      setServices(fallbackServices);
      setTotalServices(fallbackServices.length);
      setStatusCounts({
        wait: 0,
        ongoing: 0,
        finish: fallbackServices.length,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm]);

  const filteredServices = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    return services.filter((service) => {
      const matchStatus =
        statusFilter === "ทั้งหมด" || service.status === statusFilter;
      const matchSearch =
        trimmed.length === 0 ||
        service.id.toLowerCase().includes(trimmed) ||
        (service.show_id && service.show_id.toLowerCase().includes(trimmed)) ||
        service.owner_name.toLowerCase().includes(trimmed) ||
        service.pet_name.toLowerCase().includes(trimmed) ||
        service.service_type.toLowerCase().includes(trimmed);
      return matchStatus && matchSearch;
    });
  }, [statusFilter, searchTerm, services]);

  const totalPages =
    filteredServices.length === 0
      ? 1
      : Math.ceil(filteredServices.length / PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageServices = filteredServices.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const changePage = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      }
      return Math.min(totalPages, prev + 1);
    });
  };

  const handleDeleteClick = (service: AdminService) => {
    setPendingDelete(service);
  };

  const confirmDelete = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!pendingDelete || !token) return;
    setDeleting(true);
    setErrorMessage(null);

    try {
      await apiDeleteAdminService(token, pendingDelete.id);
      setPendingDelete(null);
      await loadServices();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "ไม่สามารถลบบริการได้"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell title="Services" description="จัดการบริการทั้งหมดในระบบ">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? "—" : totalServices ?? filteredServices.length}
          </p>
          <p className="text-xs text-slate-400">บริการทั้งหมด</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เสร็จสิ้น</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? "—" : statusCounts.finish}
          </p>
          <p className="text-xs text-slate-400">บริการที่เสร็จสิ้น</p>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">รายการบริการ</h2>
        </div>
        <div className="space-y-2 transition duration-300 ease-out">
          <div className="relative grid grid-cols-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50 p-1 text-sm font-medium text-slate-600">
            <span
              className="pointer-events-none absolute inset-y-1 w-1/4 rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${
                  statusTabs.indexOf(statusFilter) * 100
                }%)`,
              }}
            />
            {statusTabs.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`relative z-10 rounded-xl px-4 py-2 transition ${
                  statusFilter === status
                    ? "text-emerald-700"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {status === "ทั้งหมด"
                  ? "ทั้งหมด"
                  : statusLabels[status as ServiceStatus]}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="ค้นหาด้วยรหัสบริการ หรือชื่อเจ้าของ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-shadow duration-200 focus:shadow-lg"
            />
          </div>
        </div>{" "}
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
                className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-6 py-4 shadow-sm animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="min-w-[120px] space-y-2 flex-shrink-0">
                  <div className="h-3 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-16 rounded-full bg-slate-300" />
                </div>
                <div className="min-w-[200px] flex-1 space-y-2">
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-4 w-32 rounded-full bg-slate-300" />
                </div>
                <div className="min-w-[120px] space-y-2 flex-shrink-0">
                  <div className="h-3 w-16 rounded-full bg-slate-200" />
                  <div className="h-4 w-14 rounded-full bg-slate-300" />
                </div>
                <div className="min-w-[120px] space-y-2 flex-shrink-0">
                  <div className="h-3 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-24 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                </div>
              </article>
            ))
          ) : filteredServices.length > 0 ? (
            pageServices.map((service) => (
              <article
                key={`${service.id}`}
                className="flex items-center gap-4 rounded-3xl border border-slate-200 px-6 py-4 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg"
              >
                <div className="flex-shrink-0">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-base font-semibold text-emerald-600">
                    {service.pet_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                </div>
                <div className="min-w-[120px] flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-500">
                    รหัสบริการ
                  </p>
                  <p className="text-lg font-semibold text-emerald-600 truncate">
                    {service.show_id || service.id}
                  </p>
                </div>
                <div className="min-w-[200px] flex-1">
                  <p className="text-xs font-semibold text-slate-500">
                    ชื่อเจ้าของ
                  </p>
                  <p className="text-lg font-semibold text-emerald-700 truncate">
                    {service.owner_name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {service.service_type}
                  </p>
                </div>
                <div className="flex flex-col min-w-[120px] flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-500">สถานะ</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                      statusStyles[service.status]
                    }`}
                  >
                    {statusLabels[service.status]}
                  </span>
                </div>
                <div className="flex flex-col min-w-[120px] flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-500">วันที่</p>
                  <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {service.reserve_date_start}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    aria-label={`แก้ไข ${service.owner_name}`}
                    href={`/admin/services/edit?serviceId=${service.id}`}
                    className="rounded-full bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    aria-label={`ลบ ${service.owner_name}`}
                    onClick={() => handleDeleteClick(service)}
                    className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-3xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
              ไม่พบบริการที่ตรงกับเงื่อนไข
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
              disabled={
                page >= totalPages || loading || filteredServices.length === 0
              }
              onClick={() => changePage("next")}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              ยืนยันการลบบริการ
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              ต้องการลบบริการ{" "}
              <span className="font-semibold text-emerald-700">
                {pendingDelete.staff_name} - {pendingDelete.pet_name}
              </span>{" "}
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
                onClick={confirmDelete}
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
