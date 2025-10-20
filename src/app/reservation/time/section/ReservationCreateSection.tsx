"use client";
import ConfirmButton from "../components/ConfirmButton";
import TimeSlotPicker from "../components/TimeSlotPicker";
import PetSelector from "../components/PetSelector";
import ServiceSelector from "../components/ServiceSelector";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ReservationCreateSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get("date"); // ดึง date จาก query

  useEffect(() => {
    if (!date) {
      router.push("/reservation"); // ถ้าไม่มีวันที่ ให้กลับไปเลือกก่อน
    }
  }, [date, router]);
  const thaiDate = new Date(date ?? "").toLocaleDateString("th-TH", {
    weekday: "long",   // วันในสัปดาห์
    year: "numeric",   // ปี
    month: "long",     // เดือนแบบเต็ม
    day: "numeric",    // วันที่
    });

    return (
    <div>
    <h2 className="text-xl font-bold">เลือกเวลาและบริการ</h2>
    <p className="text-gray-500">{thaiDate}</p>
    
    <div className="mt-6 space-y-[24px]">
        <PetSelector />
        <ServiceSelector />
        <TimeSlotPicker />
        <ConfirmButton />
    </div>
</div>
    );
}
export default ReservationCreateSection;