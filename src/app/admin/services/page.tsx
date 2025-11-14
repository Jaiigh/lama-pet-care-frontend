"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type ServiceStatus = "wait" | "on_going" | "finished";

type AdminService = {
  id: string;
  userId: string;
  title: string;
  owner: string;
  price: string;
  duration: string;
  createdAt: string;
  status: ServiceStatus;
};

const mockServices: AdminService[] = [
  {
    id: "SVC-1001",
    userId: "USR-502",
    title: "Wellness Check",
    owner: "Warin K.",
    price: "฿450",
    duration: "30 นาที",
    createdAt: "2025-10-12",
    status: "wait",
  },
  {
    id: "SVC-1002",
    userId: "USR-503",
    title: "Grooming Deluxe",
    owner: "Model Pet",
    price: "฿900",
    duration: "90 นาที",
    createdAt: "2025-10-05",
    status: "on_going",
  },
  {
    id: "SVC-1003",
    userId: "USR-504",
    title: "Boarding Night",
    owner: "Thanapol K.",
    price: "฿1,200",
    duration: "1 คืน",
    createdAt: "2025-09-20",
    status: "finished",
  },
  {
    id: "SVC-1004",
    userId: "USR-505",
    title: "Spa & Relax",
    owner: "Sirikorn L.",
    price: "฿1,050",
    duration: "120 นาที",
    createdAt: "2025-09-05",
    status: "on_going",
  },
  {
    id: "SVC-1005",
    userId: "USR-506",
    title: "Vaccine Booster",
    owner: "First Clinic",
    price: "฿650",
    duration: "20 นาที",
    createdAt: "2025-08-30",
    status: "wait",
  },
];

const statusLabels: Record<ServiceStatus, string> = {
  wait: "รอเริ่ม",
  on_going: "กำลังดำเนินการ",
  finished: "เสร็จสิ้น",
};

const statusStyles: Record<ServiceStatus, string> = {
  wait: "bg-amber-50 text-amber-700",
  on_going: "bg-blue-50 text-blue-700",
  finished: "bg-emerald-50 text-emerald-700",
};

export default function ServicesPage() {
  const [statusFilter, setStatusFilter] = useState<"ทั้งหมด" | ServiceStatus>("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return mockServices.filter((service) => {
      const matchStatus = statusFilter === "ทั้งหมด" || service.status === statusFilter;
      const matchSearch =
        keyword.length === 0 ||
        service.id.toLowerCase().includes(keyword) ||
        service.title.toLowerCase().includes(keyword) ||
        service.owner.toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [statusFilter, searchTerm]);

  const counts = useMemo(() => {
    return {
      total: mockServices.length,
      wait: mockServices.filter((svc) => svc.status === "wait").length,
      onGoing: mockServices.filter((svc) => svc.status === "on_going").length,
      finished: mockServices.filter((svc) => svc.status === "finished").length,
    };
  }, []);

  return (
    <AdminShell title="Services" description="จัดการบริการทั้งหมดของระบบ (mock data)">
      <div className="grid gap-6 lg:grid-cols-4">
        <SummaryCard label="บริการทั้งหมด" value={counts.total} accent="text-slate-900" />
        <SummaryCard label="กำลังรอเริ่ม" value={counts.wait} accent="text-amber-600" />
        <SummaryCard label="กำลังดำเนินการ" value={counts.onGoing} accent="text-blue-600" />
        <SummaryCard label="เสร็จสิ้น" value={counts.finished} accent="text-emerald-600" />
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">รายการบริการ</h2>
            <p className="text-sm text-slate-500">mock data สำหรับออกแบบ UI</p>
          </div>
          <button className="rounded-xl bg-[#D89B76] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#c8865d]">
            + เพิ่มบริการ
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="relative grid grid-cols-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50 p-1 text-sm font-medium text-slate-600">
            <span
              className="pointer-events-none absolute inset-y-1 w-1/4 rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${["ทั้งหมด", "wait", "on_going", "finished"].indexOf(statusFilter) * 100}%)`,
              }}
            />
            {["ทั้งหมด", "wait", "on_going", "finished"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab as typeof statusFilter)}
                className={`relative z-10 rounded-xl px-4 py-2 ${
                  statusFilter === tab ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {tab === "ทั้งหมด" ? "ทั้งหมด" : statusLabels[tab as ServiceStatus]}
              </button>
            ))}
          </div>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยรหัสหรือชื่อบริการ..."
            className="w-full rounded-3xl border border-slate-200 px-5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-shadow duration-200 focus:shadow-lg"
          />
        </div>
      </section>

      <div className="mt-6 space-y-3">
        {filteredServices.map((service) => (
          <article
            key={service.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-base font-semibold text-emerald-600">
              {service.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-[120px]">
              <p className="text-xs font-semibold text-slate-500">User ID</p>
              <p className="text-lg font-semibold text-slate-900">{service.userId}</p>
            </div>
            <div className="min-w-[120px]">
              <p className="text-xs font-semibold text-slate-500">รหัสบริการ</p>
              <p className="text-lg font-semibold text-emerald-600">{service.id}</p>
            </div>
            <div className="min-w-[180px] flex-1">
              <p className="text-xs font-semibold text-slate-500">ชื่อบริการ</p>
              <p className="text-lg font-semibold text-slate-900">{service.title}</p>
              <p className="text-xs text-slate-500">เจ้าของ: {service.owner}</p>
            </div>
            <div className="min-w-[140px]">
              <p className="text-xs font-semibold text-slate-500">สถานะ</p>
              <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[service.status]}`}>
                {statusLabels[service.status]}
              </span>
            </div>
            <div className="min-w-[140px]">
              <p className="text-xs font-semibold text-slate-500">ราคา</p>
              <p className="text-lg font-semibold text-[#D89B76]">{service.price}</p>
              <p className="text-xs text-slate-500">{service.duration}</p>
            </div>
            <div className="min-w-[140px]">
              <p className="text-xs font-semibold text-slate-500">สร้างเมื่อ</p>
              <p className="text-lg font-semibold text-slate-900">{service.createdAt}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-full bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-700">
                จัดการ
              </button>
              <button className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600">
                ลบ
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p className="mt-6 rounded-3xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
          ไม่พบบริการที่ตรงกับเงื่อนไขที่กำหนด
        </p>
      )}
    </AdminShell>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  accent: string;
};

function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
