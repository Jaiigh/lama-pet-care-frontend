"use client";

import AdminShell from "@/components/admin/AdminShell";

const statCards = [
  { label: "Total Pets", value: "342", subtext: "เพิ่มขึ้น 12% จากเดือนก่อน" },
  { label: "Appointments Today", value: "18", subtext: "6 pending approvals" },
  { label: "Pending Requests", value: "5", subtext: "ต้องติดตามภายใน 24 ชม." },
];

const recentActivities = [
  "New pet added: \"Milo\" — 2 ชั่วโมงที่แล้ว",
  "Appointment confirmed — 3 ชั่วโมงที่แล้ว",
  "Settings updated — 1 วันที่แล้ว",
];

export default function OverviewPage() {
  return (
    <AdminShell title="Overview" description="ภาพรวมของระบบ LAMA และสถานะงานล่าสุด">
      <section className="grid gap-5 lg:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-400">{card.subtext}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recentActivities.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#D89B76]" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["สร้างการนัดหมาย", "เพิ่มบริการใหม่", "อนุมัติคำขอ", "อัปเดตราคา"].map((label) => (
              <button
                key={label}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-[#D89B76] hover:text-[#D89B76]"
              >
                {label}
              </button>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
