"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PetOwnerCardSection from "./section/PetOwnerCardSection";
import ModeSelection from "./components/ModeSelection";
import CalendarWithMode from "./components/CalendarWithMode";
import { ReservationMode } from "@/interfaces/reservationFlowInterface";
import { useReservationSelection } from "@/context/ReservationSelectionContext";

export default function ReservationPage() {
  const router = useRouter();
  const { selection, updateSelection } = useReservationSelection();

  const [selectedMode, setSelectedMode] = useState<ReservationMode | null>(
    selection.mode
  );
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    selection.startDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    selection.endDate
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    selection.date
  );

  useEffect(() => {
    setSelectedMode(selection.mode);
    setSelectedStartDate(selection.startDate);
    setSelectedEndDate(selection.endDate);
    setSelectedDate(selection.date);
  }, [selection.mode, selection.startDate, selection.endDate, selection.date]);

  const handleModeSelect = (mode: ReservationMode) => {
    setSelectedMode(mode);
    // Reset date selections when mode changes
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedDate(null);
    updateSelection({
      mode,
      date: null,
      startDate: null,
      endDate: null,
      timeSlot: null,
      petId: null,
      staffId: null,
    });
  };

  const handleDateSelect = (dates: {
    startDate?: string;
    endDate?: string;
    date?: string;
  }) => {
    if (selectedMode === "full-day") {
      setSelectedStartDate(dates.startDate || null);
      setSelectedEndDate(dates.endDate || null);
      updateSelection({
        startDate: dates.startDate || null,
        endDate: dates.endDate || null,
      });
    } else {
      setSelectedDate(dates.date || null);
      updateSelection({ date: dates.date || null });
    }
  };

  const handleNext = () => {
    if (!selectedMode) return;

    if (selectedMode === "full-day") {
      if (selectedStartDate && selectedEndDate) {
        router.push(
          `/reservation/book-full-day?startDate=${selectedStartDate}&endDate=${selectedEndDate}`
        );
      }
    } else {
      // Within-day: go to booking page with all options in one page
      if (selectedDate) {
        router.push(`/reservation/book?date=${selectedDate}`);
      }
    }
  };

  const canProceed = () => {
    if (!selectedMode) return false;
    if (selectedMode === "full-day") {
      return selectedStartDate && selectedEndDate;
    } else {
      return !!selectedDate;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF8F4] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Panel - Pet Owner Card */}
          <div className="md:col-span-4">
            <PetOwnerCardSection />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[3px] bg-[#D8D5BD]" />

          {/* Right Panel - Mode Selection + Calendar */}
          <div className="md:col-span-7">
            <ModeSelection
              selectedMode={selectedMode}
              onModeSelect={handleModeSelect}
            />

            {selectedMode && (
              <>
                <CalendarWithMode
                  mode={selectedMode}
                  onDateSelect={handleDateSelect}
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate}
                  selectedDate={selectedDate}
                />

                {canProceed() && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="bg-[#61C5AA] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#4FA889] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
