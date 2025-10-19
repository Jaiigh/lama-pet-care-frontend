"use client";

import React from "react";
import OwnerCard from "@/app/reservation/components/OwnerCard";
import Calendar from "@/app/reservation/components/Calendar";

const ReservationPage = () => {
  return (
    <div className="bg-[#EBF8F4] min-h-screen">
      <main className="mx-auto py-24 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <OwnerCard />
          </div>
          <div className="lg:col-span-8">
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationPage;
