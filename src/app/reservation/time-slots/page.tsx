"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// Mock data - no API calls for now
import {
  AvailabilityResponse,
  Staff,
  TimeSlot,
} from "@/interfaces/reservationFlowInterface";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

const TimeSlotsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "within-day";
  const date = searchParams.get("date");
  const staffId = searchParams.get("staffId");

  // Mock staff data
  const mockStaffList: Staff[] = [
    {
      id: "1",
      name: "นาย A",
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
      specialization: "Pet Grooming",
      status: "available",
    },
    {
      id: "4",
      name: "นาง D",
      avatar: undefined,
      rating: 4.9,
      specialization: "Overnight Care",
      status: "online",
    },
    {
      id: "5",
      name: "นาย E",
      avatar: undefined,
      rating: 4.6,
      specialization: "Veterinary Care",
      status: "fully-booked",
    },
  ];

  const [staff, setStaff] = useState<Staff | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !staffId) {
      setError("Missing required parameters");
      return;
    }

    // Use mock staff data
    const staffData = mockStaffList.find((s) => s.id === staffId);
    if (staffData) {
      setStaff(staffData);
    } else {
      setError("Staff not found");
      return;
    }

    // Generate mock time slots (09:00 to 18:00)
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({
        time,
        available: Math.random() > 0.3, // 70% available (mock logic)
      });
    }
    setTimeSlots(slots);
  }, [date, staffId]);

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleProceed = () => {
    if (!selectedSlot || !staffId || !date) return;

    router.push(
      `/reservation/payment?mode=${mode}&date=${date}&staffId=${staffId}&timeSlot=${selectedSlot}`
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("D MMM YYYY");
  };

  const displaySlots = timeSlots;

  return (
    <div className="min-h-screen bg-[#EBF8F4] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Select an available time slot
        </h1>
        {staff && date && (
          <p className="text-gray-600 mb-8">
            Staff: <span className="font-semibold">{staff.name}</span>, Date:{" "}
            <span className="font-semibold">{formatDate(date)}</span>
          </p>
        )}

        {error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
              {displaySlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleSlotSelect(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedSlot === slot.time
                      ? "bg-[#61C5AA] text-white shadow-md"
                      : slot.available
                      ? "bg-white border-2 border-gray-200 hover:border-[#61C5AA] hover:bg-[#EBF8F4] text-gray-800"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {selectedSlot && (
              <div className="mt-6 p-4 bg-[#EBF8F4] rounded-lg">
                <p className="text-gray-800 font-medium mb-4">
                  Selected time:{" "}
                  <span className="font-bold">{selectedSlot}</span>
                </p>
                <button
                  onClick={handleProceed}
                  className="bg-[#61C5AA] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#4FA889] transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function TimeSlotsLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#EBF8F4] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#61C5AA]" />
        </div>
      </div>
    </div>
  );
}

export default function TimeSlotsPage() {
  return (
    <Suspense fallback={<TimeSlotsLoadingFallback />}>
      <TimeSlotsContent />
    </Suspense>
  );
}
