"use client";

import React from "react";
import OwnerCard from "@/app/reservation/components/OwnerCard";
import Calendar from "@/app/reservation/components/Calendar";

const ReservationPage = () => {
  return (
    <div className="bg-[#EBF8F4] min-h-screen">
      <main className="max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <OwnerCard />
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
