"use client";

import React from "react";
import OwnerCard from "@/app/reservation/components/OwnerCard";
import Calendar from "@/app/reservation/components/Calendar";
import { useAuth } from "@/hooks/useAuth";

const ReservationPage = () => {
  const { isAuthed } = useAuth();

  return (
    <div className="bg-[#EBF8F4] min-h-screen">
      <main className="max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            {isAuthed ? (
              <OwnerCard />
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
                <div className="text-gray-600">
                  กรุณาเข้าสู่ระบบก่อนเพื่อทำรายการ
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-8">
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationPage;
