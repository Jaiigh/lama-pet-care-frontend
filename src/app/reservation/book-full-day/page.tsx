"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PetOwnerCardSection from "../section/PetOwnerCardSection";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useReservationSelection } from "@/context/ReservationSelectionContext";
import { getAvailableStaff, getStaffArray, type StaffArrayResponse } from "@/services/serviceService";
import { getPetsByOwner } from "@/services/petservice";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const BookFullDayPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStart = searchParams.get("startDate");
  const urlEnd = searchParams.get("endDate");
  const serviceType = "cservice"; //mock service type
  const { selection, updateSelection } = useReservationSelection();

  // State for API data
  const [staffData, setStaffData] = useState<StaffArrayResponse | null>(null);
  const [petsData, setPetsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const effectiveStart = useMemo(
    () => urlStart || selection.startDate,
    [urlStart, selection.startDate]
  );
  const effectiveEnd = useMemo(
    () => urlEnd || selection.endDate,
    [urlEnd, selection.endDate]
  );

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      if (!effectiveStart || !effectiveEnd) return;

      try {
        setLoading(true);
        const data = await getAvailableStaff({
          serviceType: serviceType as any, // "cservice"
          serviceMode: "full-day",
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });
        setStaffData(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch staff:", err);
        setError(err.message || "Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [effectiveStart, effectiveEnd, serviceType]);

  // Fetch pets data
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const pets = await getPetsByOwner();
        setPetsData(pets);
      } catch (err: any) {
        console.error("Failed to fetch pets:", err);
        // Keep empty array for pets if fetch fails
        setPetsData([]);
      }
    };

    fetchPets();
  }, []);

  // Get staff list from API response
  const staffList = useMemo(() => {
    return staffData ? getStaffArray(staffData) : [];
  }, [staffData]);

  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");

  // Since we only show available staff, all selected staff are available
  const isStaffAvailable = !!selectedStaff;

  useEffect(() => {
    setSelectedPet(selection.petId || "");
    if (
      selection.staffId &&
      staffList.some((staff) => staff.id === selection.staffId)
    ) {
      setSelectedStaff(selection.staffId);
    } else {
      setSelectedStaff("");
      if (selection.staffId) {
        updateSelection({ staffId: null });
      }
    }
  }, [selection.petId, selection.staffId, staffList, updateSelection]);

  useEffect(() => {
    if (
      effectiveStart &&
      effectiveEnd &&
      (selection.startDate !== effectiveStart ||
        selection.endDate !== effectiveEnd)
    ) {
      updateSelection({ startDate: effectiveStart, endDate: effectiveEnd });
    }
  }, [
    effectiveStart,
    effectiveEnd,
    selection.startDate,
    selection.endDate,
    updateSelection,
  ]);

  useEffect(() => {
    if (!effectiveStart || !effectiveEnd) {
      router.replace("/reservation");
    }
  }, [effectiveStart, effectiveEnd, router]);

  const formatDateRange = () => {
    if (!effectiveStart || !effectiveEnd) return "";
    const start = dayjs(effectiveStart);
    const end = dayjs(effectiveEnd);
    const thaiDays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const startDayName = thaiDays[start.day()];
    const startDay = start.date();
    const startMonth = thaiMonths[start.month()];
    const endDay = end.date();
    const endMonth = thaiMonths[end.month()];
    const year = start.year() + 543; // Convert to Buddhist era

    return `สำหรับวัน${startDayName}ที่ ${startDay} - ${endDay} ${endMonth} ${year}`;
  };

  const handlePayment = () => {
    if (!selectedPet || !selectedStaff || !effectiveStart || !effectiveEnd) {
      alert("กรุณาเลือกสัตว์เลี้ยงและ staff ก่อน");
      return;
    }

    updateSelection({
      petId: selectedPet,
      staffId: selectedStaff,
      startDate: effectiveStart,
      endDate: effectiveEnd,
      timeSlot: null,
    });

    router.push(
      `/reservation/payment?mode=full-day&startDate=${effectiveStart}&endDate=${effectiveEnd}&staffId=${selectedStaff}&petId=${selectedPet}`
    );
  };

  const canProceed = selectedPet && selectedStaff;

  return (
    <div className="min-h-screen bg-[#EBF8F4] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 items-start">
          {/* ด้านซ้าย - Pet Owner Card */}
          <div className="flex justify-center md:justify-start md:pr-8">
            <PetOwnerCardSection />
          </div>

          {/* เส้นแบ่งแนวตั้ง */}
          <div className="hidden md:block w-[3px] bg-[#D8D5BD] rounded-full self-stretch md:my-4" />

          {/* ด้านขวา - Booking Form */}
          <div className="md:pl-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              เลือกเวลาทำการ
            </h1>
            {effectiveStart && effectiveEnd && (
              <p className="text-gray-600 mb-8">{formatDateRange()}</p>
            )}

            {/* 1. สัตว์เลี้ยง */}
            <div className="mb-6">
              <label className="block mb-3 font-medium text-gray-700">
                1. สัตว์เลี้ยง
              </label>
              <div className="relative w-full md:w-[280px]">
                <select
                  value={selectedPet}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedPet(value);
                    updateSelection({ petId: value || null });
                  }}
                  className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                  disabled={loading}
                >
                  <option value="">
                    {loading ? "กำลังโหลด..." : "สัตว์เลี้ยง"}
                  </option>
                  {petsData.map((pet) => (
                    <option key={pet.pet_id} value={pet.pet_id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. Staff */}
            <div className="mb-6">
              <label className="block mb-3 font-medium text-gray-700">
                2. staff
              </label>
              {error && (
                <div className="text-red-500 text-sm mb-2">
                  {error}
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-[280px]">
                  <select
                    value={selectedStaff}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedStaff(value);
                      updateSelection({ staffId: value || null });
                    }}
                    className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? "กำลังโหลด..." : "เลือก staff"}
                    </option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ปุ่มชำระเงิน */}
            <div className="mt-6">
              <button
                onClick={handlePayment}
                disabled={!canProceed}
                className={`w-full md:w-auto min-w-[200px] font-bold py-3 px-8 rounded-lg transition-colors ${
                  canProceed
                    ? "bg-[#61C5AA] text-white hover:bg-[#4FA889] cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                ชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFullDayPage;
