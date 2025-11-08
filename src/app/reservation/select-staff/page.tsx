"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAvailability } from "@/services/reservationFlowService";
import {
  ReservationMode,
  Staff,
  AvailabilityResponse,
} from "@/interfaces/reservationFlowInterface";
import dayjs from "dayjs";
import { Loader2, CheckCircle, XCircle, User } from "lucide-react";

const SelectStaffPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as ReservationMode) || "within-day";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const date = searchParams.get("date");

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

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] =
    useState<AvailabilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStaffSelect = async (staff: Staff) => {
    setSelectedStaff(staff);
    setAvailabilityResult(null);
    setError(null);

    if (mode === "full-day") {
      // Check availability for full-day
      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        return;
      }

      setCheckingAvailability(true);
      try {
        const result = await checkAvailability({
          mode: "full-day",
          startDate,
          endDate,
          staffId: staff.id,
        });
        setAvailabilityResult(result);
      } catch (err) {
        console.error("Error checking availability:", err);
        setError("Failed to check availability");
        setAvailabilityResult({
          available: false,
          message: "Error checking availability",
        });
      } finally {
        setCheckingAvailability(false);
      }
    } else {
      // For within-day, proceed to time slots
      router.push(
        `/reservation/time-slots?mode=${mode}&date=${date}&staffId=${staff.id}`
      );
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedStaff) return;

    if (mode === "full-day") {
      router.push(
        `/reservation/payment?mode=${mode}&startDate=${startDate}&endDate=${endDate}&staffId=${selectedStaff.id}`
      );
    }
  };

  const formatDateRange = () => {
    if (mode === "full-day" && startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      return `${start.format("D MMM YYYY")} – ${end.format("D MMM YYYY")}`;
    } else if (date) {
      const d = dayjs(date);
      return d.format("D MMM YYYY");
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-[#EBF8F4] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {mode === "full-day"
            ? "Select sitter for your stay"
            : "Select sitter for your appointment"}
        </h1>
        <p className="text-gray-600 mb-8">
          {mode === "full-day" ? "For your stay: " : "For: "}
          <span className="font-semibold">{formatDateRange()}</span>
        </p>

        {error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            {mockStaffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => handleStaffSelect(staff)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStaff?.id === staff.id
                    ? "border-[#61C5AA] bg-[#EBF8F4] shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {staff.avatar ? (
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {staff.name}
                    </h3>
                    {staff.rating && (
                      <p className="text-sm text-gray-600">
                        ⭐ {staff.rating.toFixed(1)} / 5.0
                      </p>
                    )}
                    {staff.specialization && (
                      <p className="text-sm text-gray-500">
                        {staff.specialization}
                      </p>
                    )}
                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          staff.status === "online"
                            ? "bg-green-100 text-green-800"
                            : staff.status === "available"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {staff.status === "online"
                          ? "Online"
                          : staff.status === "available"
                          ? "Available"
                          : "Fully booked"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Availability Result (Full-day mode only) */}
        {mode === "full-day" && selectedStaff && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            {checkingAvailability ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#61C5AA]" />
                <span className="text-gray-600">Checking availability...</span>
              </div>
            ) : availabilityResult ? (
              <div>
                {availabilityResult.available ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-700 font-medium">
                        This sitter is available for your selected dates.
                      </p>
                      <button
                        onClick={handleProceedToPayment}
                        className="mt-4 bg-[#61C5AA] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#4FA889] transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-700 font-medium">
                        {availabilityResult.message ||
                          "This sitter is not available for your selected dates."}
                      </p>
                      {availabilityResult.conflictingDates && (
                        <p className="text-sm text-gray-600 mt-2">
                          Conflicting dates:{" "}
                          {availabilityResult.conflictingDates.join(", ")}
                        </p>
                      )}
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedStaff(null);
                            setAvailabilityResult(null);
                          }}
                          className="text-[#61C5AA] font-medium hover:underline"
                        >
                          Try another staff
                        </button>
                        <button
                          onClick={() => router.back()}
                          className="text-gray-600 font-medium hover:underline"
                        >
                          Adjust dates
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectStaffPage;
