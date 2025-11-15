"use client";

import { useMemo, useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { Payment } from "@/interfaces/paymentInterface";
import { getAllPayment } from "@/services/paymentService";

type SortOrder = "desc" | "asc";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const paymentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function buildMonthOptions(records: Payment[]): string[] {
  const months = new Set<string>();
  records.forEach((record) => {
    const label = monthFormatter.format(new Date(record.pay_date)); // changed
    months.add(label);
  });
  const sorted = Array.from(months).sort((a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return db.getTime() - da.getTime();
  });
  return ["ทั้งหมด", ...sorted];
}

function monthLabelToDate(label: string): Date | null {
  if (label === "ทั้งหมด") return null;
  const [month, year] = label.split(" ");
  return new Date(`${month} 1, ${year}`);
}

export default function PaymentHistory() {
  const [selectedMonth, setSelectedMonth] = useState<string>("ทั้งหมด");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getAllPayment();
        // support both direct array or { data: array }
        const records: Payment[] = resp ?? [];
        if (mounted) setPayments(records);
      } catch (err) {
        console.error("getAllPayment error:", err);
        if (mounted) setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  const monthOptions = useMemo(() => buildMonthOptions(payments), [payments]);

  const filteredAndSortedRecords = useMemo(() => {
    const monthDate = monthLabelToDate(selectedMonth);

    const filtered = payments.filter((record) => {
      if (!monthDate) return true;
      const recordDate = new Date(record.pay_date); // changed
      return (
        recordDate.getFullYear() > monthDate.getFullYear() ||
        (recordDate.getFullYear() === monthDate.getFullYear() &&
          recordDate.getMonth() >= monthDate.getMonth())
      );
    });

    return filtered.sort((a, b) => {
      const aTime = new Date(a.pay_date).getTime(); // changed
      const bTime = new Date(b.pay_date).getTime(); // changed
      return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
    });
  }, [payments, selectedMonth, sortOrder]);

  return (
    <section className="w-full">
      <div className="bg-white rounded-2xl  p-6 md:p-8 border border-[#ccc]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[#072568]">
            <ClipboardList className="h-5 w-5 md:h-6 md:w-6" />
            <h2 className="text-lg font-semibold md:text-xl">ประวัติการใช้จ่าย</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <label className="w-full sm:w-auto">
              <span className="sr-only">ตั้งแต่เดือน</span>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="inline-flex w-full min-w-[160px] items-center justify-between rounded-2xl border border-[#DADADA] bg-white px-4 py-2 text-sm text-[#072568] transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#61C5AA]/60"
              >
                {monthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="w-full sm:w-auto">
              <span className="sr-only">เรียงลำดับ</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="inline-flex w-full min-w-[140px] items-center justify-between rounded-2xl border border-[#DADADA] bg-white px-4 py-2 text-sm text-[#072568] transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#61C5AA]/60"
              >
                <option value="desc">ใหม่ที่สุด</option>
                <option value="asc">เก่าสุด</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E8E8]">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-[#E8E8E8] text-[#072568]">
              <thead>
                <tr className="bg-white text-left text-sm font-semibold uppercase tracking-wide text-[#072568]">
                  <th className="px-6 py-3">Payment ID</th>
                  <th className="px-6 py-3">วันที่ชำระ</th>
                  <th className="px-6 py-3 text-right">จำนวน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-sm font-medium text-[#383A45]">
                {filteredAndSortedRecords.map((payment) => (
                  <tr key={payment.payment_id} className="h-14">
                    <td className="px-6 py-4 align-middle">{payment.payment_id || "-"}</td><td className="px-6 py-4 align-middle">{paymentDateFormatter.format(new Date(payment.pay_date)) || "-"}</td><td className="px-6 py-4 align-middle text-right">{payment.price ?? "-"}</td>
                  </tr>
                ))}
                {filteredAndSortedRecords.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">ไม่พบประวัติการชำระเงินในช่วงเวลาที่เลือก</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
