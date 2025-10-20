"use client";
import PetOwnerCardSection from "../section/PetOwnerCardSection";
import ReservationCreateSection from "../section/ReservationCreateSection";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center bg-[#EBF8F4] p-8">
      <div className="bg-white shadow-lg rounded-lg w-screen h-[700px]">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* ด้านซ้าย */}
          <div className="w-full md:w-2/5 px-[35px] pt-[90px]">
            <PetOwnerCardSection />
          </div>

          {/* เส้นแบ่งแนวตั้ง (ซ่อนบนจอเล็ก) */}
          <div className="hidden md:block w-[3px] h-[594px] bg-[#D8D5BD]" />

          {/* ด้านขวา */}
          <div className="w-full md:w-3/5 p-8">
            <ReservationCreateSection/>
          </div>
        </div>
      </div>
    </div>
  );
}