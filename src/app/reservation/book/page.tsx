"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PetOwnerCardSection from "../section/PetOwnerCardSection";
import { Staff } from "@/interfaces/reservationFlowInterface";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useReservationSelection } from "@/context/ReservationSelectionContext";
import getAvailableStaff from "@/services/serviceService";
dayjs.extend(buddhistEra);
dayjs.locale("th");

const PAYMENT_REDIRECT_URL = "https://youtu.be/x3IABpPUcC8?si=Muka58AIAouHswTQ";

const BookPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlDate = searchParams.get("date");
  const { selection, updateSelection } = useReservationSelection();

  const effectiveDate = useMemo(
    () => urlDate || selection.date,
    [urlDate, selection.date]
  );

  // Mock staff data
  const mockStaffList: Staff[] = [
    {
      id: "1",
      name: "อาก้า",
      avatar: undefined,
      rating: 4.5,
      specialization: "Pet Sitting",
      status: "online",
    },
    {
      id: "2",
      name: "นาย B",
      avatar: undefined,
      rating: 4.8,
      specialization: "Dog Walking",
      status: "available",
    },
    {
      id: "3",
      name: "นาย C",
      avatar: undefined,
      rating: 4.2,
      specialization: "Dog Walking",
      status: "available",
    },
  ];

  // Mock pet data
  const mockPets = [
    { id: "1", name: "สัตว์เลี้ยง" },
    { id: "2", name: "โบ้" },
    { id: "3", name: "แงว" },
  ];

  // Mock time slots
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<
    "" | "mservice" | "cservice"
  >("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  // Sync initial state from context
  useEffect(() => {
    setSelectedPet(selection.petId || "");
    setSelectedServiceType(selection.serviceType || "");
    setSelectedStaff(selection.staffId || "");
    const normalizedSlots = Array.isArray(selection.timeSlot)
      ? selection.timeSlot
      : typeof selection.timeSlot === "string"
      ? [selection.timeSlot]
      : [];
    setSelectedTimeSlots(normalizedSlots);
  }, [
    selection.petId,
    selection.serviceType,
    selection.staffId,
    selection.timeSlot,
  ]);

  // Ensure date is stored for subsequent pages
  useEffect(() => {
    if (effectiveDate && selection.date !== effectiveDate) {
      updateSelection({ date: effectiveDate });
    }
  }, [effectiveDate, selection.date, updateSelection]);

  useEffect(() => {
    if (!effectiveDate) {
      router.replace("/reservation");
    }
  }, [effectiveDate, router]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = dayjs(dateStr);
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
    const dayName = thaiDays[d.day()];
    const day = d.date();
    const month = thaiMonths[d.month()];
    const year = d.year() + 543; // Convert to Buddhist era
    return `สำหรับวัน${dayName}ที่ ${day} ${month} ${year}`;
  };

  const handlePayment = () => {
    if (
      !selectedPet ||
      !selectedServiceType ||
      !selectedStaff ||
      selectedTimeSlots.length === 0 ||
      !effectiveDate
    ) {
      alert(
        "กรุณาเลือกสัตว์เลี้ยง, ประเภทบริการ, staff และช่วงเวลาที่ต้องการก่อน"
      );
      return;
    }

    updateSelection({
      petId: selectedPet,
      serviceType: selectedServiceType,
      staffId: selectedStaff,
      timeSlot: selectedTimeSlots,
    });

    if (typeof window !== "undefined") {
      window.location.href = PAYMENT_REDIRECT_URL;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF8F4] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 items-start">
          {/* ซ้าย - Pet Owner Card */}
          <div className="flex justify-center md:justify-start md:pr-8">
            <PetOwnerCardSection />
          </div>

          {/* เส้นแบ่ง */}
          <div className="hidden md:block w-[3px] bg-[#D8D5BD] rounded-full self-stretch md:my-4" />

          {/* ขวา - Booking Form */}
          <div className="md:pl-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              เลือกเวลาทำการ
            </h1>
            {effectiveDate && (
              <p className="text-gray-600 mb-8">{formatDate(effectiveDate)}</p>
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
                >
                  <option value="">สัตว์เลี้ยง</option>
                  {mockPets
                    .filter((pet) => pet.id !== "1")
                    .map((pet) => (
                      <option key={pet.id} value={pet.id}>
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
                    setSelectedTimeSlots([]);
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
              <div className="relative w-full md:w-[280px]">
                <select
                  value={selectedStaff}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedStaff(value);
                    updateSelection({
                      staffId: value || null,
                      // clear timeslot when changing staff to avoid mismatched data
                      timeSlot: [],
                    });
                    setSelectedTimeSlots([]);
                  }}
                  className="w-full h-[60px] px-4 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61C5AA] appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">เลือก staff</option>
                  {mockStaffList.map((staff) => (
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

            {/* 4. เลือกช่วงเวลาที่ต้องการ */}
            <div className="mb-8">
              <label className="block mb-4 font-medium text-gray-700">
                4. เลือกช่วงเวลาที่ต้องการ
              </label>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTimeSlots((prev) => {
                        const alreadySelected = prev.includes(time);
                        const next = alreadySelected
                          ? prev.filter((slot) => slot !== time)
                          : [...prev, time];
                        updateSelection({ timeSlot: next });
                        return next;
                      });
                    }}
                    className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
                      selectedTimeSlots.includes(time)
                        ? "bg-[#61C5AA] text-white border-[#61C5AA] shadow-md"
                        : "bg-white border-gray-200 text-gray-800 hover:border-[#61C5AA] hover:bg-[#EBF8F4]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
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
                  onClick={handlePayment}
                  disabled={
                    !selectedPet ||
                    !selectedServiceType ||
                    !selectedStaff ||
                    selectedTimeSlots.length === 0
                  }
                  className="inline-flex items-center justify-center rounded-lg bg-[#61C5AA] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#4FA889] disabled:bg-gray-400 disabled:cursor-not-allowed md:min-w-[260px]"
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

export default BookPage;
