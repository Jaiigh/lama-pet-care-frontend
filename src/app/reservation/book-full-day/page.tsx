"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PetOwnerCardSection from "../section/PetOwnerCardSection";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useReservationSelection } from "@/context/ReservationSelectionContext";
import { getAvailableStaff, type Staff } from "@/services/serviceService";
import serviceService from "@/services/serviceService";
import { getPetsByOwner } from "@/services/petservice";
import { Pet } from "@/interfaces/profileInterface";
import { serviceType,serviceMode } from "@/interfaces/serviceInterface"

dayjs.extend(buddhistEra);
dayjs.locale("th");



const BookFullDayPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStart = searchParams.get("startDate");
  const urlEnd = searchParams.get("endDate");
  const { selection, updateSelection } = useReservationSelection();

  // State for API data
  const [cstaffData, setCStaffData] = useState<Staff[] | null>(null);
  const [mstaffData, setMStaffData] = useState<Staff[] | null>(null);
  const [petsData, setPetsData] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [PAYMENT_REDIRECT_URL,setPAYMENT_REDIRECT_URL] = useState("this/auth/login");
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
        const Cdata = await getAvailableStaff({
          serviceType: "cservice" as serviceType,
          serviceMode: "full-day" as serviceMode,
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });
        const Mdata = await getAvailableStaff({
          serviceType: "mservice" as serviceType,
          serviceMode: "full-day" as serviceMode,
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });
        setCStaffData(Cdata);
        setMStaffData(Mdata);
      } catch (err: any) {
        console.error("Failed to fetch staff:", err);
        setError(err.message || "Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [effectiveStart, effectiveEnd]);

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

  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<
    "" | "mservice" | "cservice"
  >("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [starttimeSlots, setStarttimeSlots] = useState<string[]>([]);
  const [endtimeSlots, setEndtimeSlots] = useState<string[]>([]);

  // Fetch available time slots when staff is selected
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedStaff || !effectiveStart || !effectiveEnd || !selectedServiceType) {
        setStarttimeSlots([]);
        setEndtimeSlots([]);
        return;
      }

      try {
        const availableSlots = await serviceService.getAvailableTimeSlots({
          serviceType: selectedServiceType,
          staffID: selectedStaff,
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });

        setStarttimeSlots(availableSlots.start);
        setEndtimeSlots(availableSlots.stop);
      } catch (err: any) {
        console.error("Failed to fetch available time slots:", err);
        setStarttimeSlots([]);
        setEndtimeSlots([]);
      }
    };

    fetchAvailableTimeSlots();
  }, [selectedStaff, effectiveStart, effectiveEnd, selectedServiceType]);



  // Get staff list from API response
  const staffList = useMemo(() => {
    let result: Staff[] = [];
    if (selectedServiceType === "mservice") {
      result = Array.isArray(mstaffData) ? mstaffData : [];
    } else if (selectedServiceType === "cservice") {
      result = Array.isArray(cstaffData) ? cstaffData : [];
    } else {
      result = [];
    }
    return result;
  }, [cstaffData, mstaffData, selectedServiceType]);

  useEffect(() => {
    setSelectedPet(selection.petId || "");
    setSelectedServiceType(selection.serviceType || "");
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
  }, [
    selection.petId,
    selection.serviceType,
    selection.staffId,
    staffList,
    updateSelection,
  ]);

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
    const endDay = end.date();
    const endMonth = thaiMonths[end.month()];
    const year = start.year() + 543; // Buddhist era

    return `สำหรับวัน${startDayName}ที่ ${startDay} - ${endDay} ${endMonth} ${year}`;
  };

  const handleSubmit = () => {
    if (
      !selectedPet ||
      !selectedServiceType ||
      !selectedStaff ||
      !effectiveStart ||
      !effectiveEnd ||
      !startTime ||
      !endTime
    ) {
      alert(
        "กรุณาเลือกสัตว์เลี้ยง, ประเภทบริการ, staff, เวลาเริ่ม และเวลาจบ ก่อน"
      );
      return;
    }

    updateSelection({
      petId: selectedPet,
      serviceType: selectedServiceType,
      staffId: selectedStaff,
      startDate: effectiveStart,
      endDate: effectiveEnd,
      timeSlot: [startTime, endTime],
    });

    if (typeof window !== "undefined") {
      window.location.href = PAYMENT_REDIRECT_URL;
    }
  };

  const canProceed =
    selectedPet && selectedServiceType && selectedStaff && startTime && endTime;

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

            {/* 2. ประเภทบริการ */}
            <div className="mb-6">
              <label className="block mb-3 font-medium text-gray-700">
                2. ประเภทบริการ
              </label>
              <div className="relative w-full md:w-[280px]">
                <select
                  value={selectedServiceType}
                  onChange={(event) => {
                    const value = event.target.value as
                      | "mservice"
                      | "cservice"
                      | "";
                    setSelectedServiceType(value);
                    updateSelection({
                      serviceType: value || null,
                      staffId: null,
                      timeSlot: [],
                    });
                    setSelectedStaff("");
                  }}
                  className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">เลือกประเภทบริการ</option>
                  <option value="mservice">หมอ</option>
                  <option value="cservice">พี่เลี้ยง</option>
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

            {/* 3. Staff */}
            <div className="mb-6">
              <label className="block mb-3 font-medium text-gray-700">
                3. staff
              </label>
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-[280px]">
                  <select
                    value={selectedStaff}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedStaff(value);
                      updateSelection({ staffId: value || null });
                      // Clear selected times when staff changes
                      setStartTime("");
                      setEndTime("");
                    }}
                    className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? "กำลังโหลด..." : "เลือก staff"}
                    </option>
                    {Array.isArray(staffList) &&
                      staffList.map((staff) => (
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

            {/* 4. เวลาเริ่มและเวลาจบ */}
            <div className="mb-6">
              <label className="block mb-3 font-medium text-gray-700">
                4. เวลาเริ่มและเวลาจบ
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                {/* เวลาเริ่มของวันแรก */}
                <div className="relative w-full md:w-[280px]">
                  <label className="block mb-2 text-sm text-gray-600">
                    เวลาเริ่มของวันแรก
                  </label>
                  <div className="relative">
                    <select
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                      }}
                      className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                    >
                      <option value="">เลือกเวลาเริ่ม</option>
                      {starttimeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
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

                {/* เวลาจบของวันสุดท้าย */}
                <div className="relative w-full md:w-[280px]">
                  <label className="block mb-2 text-sm text-gray-600">
                    เวลาจบของวันสุดท้าย
                  </label>
                  <div className="relative">
                    <select
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                      }}
                      className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                    >
                      <option value="">เลือกเวลาจบ</option>
                      {endtimeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
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
            </div>

            {/* ปุ่มชำระเงิน */}
            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center rounded-lg border border-[#61C5AA] px-6 py-3 text-sm font-semibold text-[#61C5AA] transition-colors hover:bg-[#EBF8F4]"
                >
                  ← กลับ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className={`inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold transition-colors md:min-w-[260px] ${
                    canProceed
                      ? "bg-[#61C5AA] text-white hover:bg-[#4FA889]"
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
    </div>
  );
};

// --------------------------
// Suspense wrapper (default export)
// --------------------------
export default function BookFullDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EBF8F4] py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl px-6 md:px-12 py-12">
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 items-start">
              <div className="h-64 w-full bg-gray-200 rounded-xl" />
              <div className="hidden md:block w-[3px] bg-[#D8D5BD] rounded-full self-stretch md:my-4" />
              <div className="space-y-6">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-80 bg-gray-200 rounded" />
                <div className="h-14 w-72 bg-gray-200 rounded" />
                <div className="h-14 w-72 bg-gray-200 rounded" />
                <div className="h-14 w-72 bg-gray-200 rounded" />
                <div className="flex gap-4">
                  <div className="h-10 w-28 bg-gray-200 rounded" />
                  <div className="h-10 w-64 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <BookFullDayPageInner />
    </Suspense>
  );
}
