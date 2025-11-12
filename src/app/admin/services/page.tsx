"use client";

import AdminShell from "@/components/admin/AdminShell";

const services = [
  {
    title: "Wellness Check",
    price: "฿450",
    duration: "30 นาที",
    desc: "ตรวจสุขภาพพื้นฐานพร้อมปรึกษาแพทย์",
  },
  {
    title: "Grooming Deluxe",
    price: "฿900",
    duration: "90 นาที",
    desc: "อาบน้ำ ตัดแต่งขน และดูแลเล็บครบชุด",
  },
  {
    title: "Boarding Night",
    price: "฿1,200",
    duration: "1 คืน",
    desc: "ฝากดูแลพร้อมกิจกรรมตามตาราง",
  },
];

export default function ServicesPage() {
  return (
    <AdminShell title="Services" description="กำหนดแพ็กเกจและราคาเพื่อให้ทีมดูแลได้มาตรฐานเดียวกัน">
      <div className="grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <span className="text-sm font-medium text-slate-400">{service.duration}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{service.desc}</p>
            <p className="mt-6 text-3xl font-semibold text-[#D89B76]">{service.price}</p>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                แก้ไข
              </button>
              <button className="flex-1 rounded-xl bg-[#D89B76] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-[#c8865d]">
                เปิดใช้งาน
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Need more?</p>
        <h4 className="mt-2 text-2xl font-semibold text-slate-900">สร้างบริการใหม่</h4>
        <p className="mt-3 text-sm text-slate-500">กรอกเวลา ราคา และรายละเอียดเพื่อให้ทีมดูแลได้ข้อมูลครบถ้วน</p>
        <button className="mt-5 rounded-2xl border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white">
          + เพิ่มบริการ
        </button>
      </section>
    </AdminShell>
  );
}
