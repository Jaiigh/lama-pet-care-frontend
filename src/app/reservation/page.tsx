"use client";

import React from "react";
import OwnerCard from "@/app/reservation/components/OwnerCard";
import Calendar from "@/app/reservation/components/Calendar";
import { useAuth } from "@/hooks/useAuth";

const ReservationPage = () => {
  const { isAuthed } = useAuth();

  return (
    <div className="bg-[#EBF8F4] min-h-screen flex items-start justify-center pt-8">
      <main className="max-w-7xl w-full mx-auto px-4">
        {/* รวมเป็น card เดียว */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* ส่วนซ้าย: โปรไฟล์ */}
            <div className="md:col-span-4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-300">
              {isAuthed ? (
                <OwnerCard />
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                  <div className="text-gray-600">
                    กรุณาเข้าสู่ระบบก่อนเพื่อทำรายการ
                  </div>
                </div>
              )}
            </div>

            {/* ส่วนขวา: ปฏิทิน */}
            <div className="md:col-span-8 p-4 md:p-6">
              <Calendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationPage;
