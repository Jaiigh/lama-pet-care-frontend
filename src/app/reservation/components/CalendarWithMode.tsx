"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatToThaiBuddhistDate, thaiDayShortNames } from "@/utils/thaiDate";
import CalendarDay from "@/app/reservation/components/CalendarDay";
import { DayInfo } from "@/interfaces/profileInterface";
import { ReservationMode } from "@/interfaces/reservationFlowInterface";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface CalendarWithModeProps {
  mode: ReservationMode;
  onDateSelect: (dates: {
    startDate?: string;
    endDate?: string;
    date?: string;
  }) => void;
  selectedStartDate?: string | null;
  selectedEndDate?: string | null;
  selectedDate?: string | null;
}

const CalendarWithMode: React.FC<CalendarWithModeProps> = ({
  mode,
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const handleDateClick = (date: string) => {
    if (mode === "full-day") {
      // Range selection logic
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Start new selection
        onDateSelect({ startDate: date, endDate: undefined });
      } else if (selectedStartDate && !selectedEndDate) {
        // Select end date
        const start = dayjs(selectedStartDate);
        const end = dayjs(date);

        if (end.isBefore(start, "day")) {
          // If clicked date is before start, make it the new start
          onDateSelect({ startDate: date, endDate: selectedStartDate });
        } else {
          // Normal end date selection
          onDateSelect({ startDate: selectedStartDate, endDate: date });
        }
      }
    } else {
      // Single date selection for within-day
      onDateSelect({ date });
    }
  };

  const generateCalendarGrid = (): (DayInfo | null)[] => {
    const today = dayjs();
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();
    const startDayOfWeek = startOfMonth.day();

    const grid: (DayInfo | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentMonth.date(day);
      const dateString = date.format("YYYY-MM-DD");
      const dateObj = dayjs(dateString);

      let isSelected = false;
      let isInRange = false;

      if (mode === "full-day") {
        isSelected =
          dateString === selectedStartDate || dateString === selectedEndDate;
        if (selectedStartDate && selectedEndDate) {
          const start = dayjs(selectedStartDate);
          const end = dayjs(selectedEndDate);
          isInRange =
            dateObj.isAfter(start, "day") && dateObj.isBefore(end, "day");
        }
      } else {
        isSelected = dateString === selectedDate;
      }

      grid.push({
        date: dateString,
        dayOfMonth: day,
        isToday: date.isSame(today, "day"),
        isSelected: isSelected || isInRange,
        hasBooking: false,
        badges: [],
        isDisabled: date.isBefore(today, "day"),
      });
    }

    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const getSelectedDatesDisplay = () => {
    if (mode === "full-day") {
      if (selectedStartDate && selectedEndDate) {
        const start = dayjs(selectedStartDate);
        const end = dayjs(selectedEndDate);
        return `Selected: ${start.format("D MMM YYYY")} – ${end.format(
          "D MMM YYYY"
        )}`;
      } else if (selectedStartDate) {
        const start = dayjs(selectedStartDate);
        return `Selected start: ${start.format("D MMM YYYY")}`;
      }
      return null;
    } else {
      if (selectedDate) {
        const date = dayjs(selectedDate);
        return `Selected: ${date.format("D MMM YYYY")}`;
      }
      return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
          เลือกวันที่
        </h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-[#FBE08C] transition-colors"
            aria-label="เดือนก่อนหน้า"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-base md:text-lg lg:text-xl font-semibold text-gray-700 w-32 md:w-40 lg:w-48 text-center">
            {formatToThaiBuddhistDate(currentMonth)}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-[#FBE08C] transition-colors"
            aria-label="เดือนถัดไป"
          >
            <ChevronRight size={20} className="text-gray-800" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3 lg:gap-4 text-center">
        {thaiDayShortNames.map((day: string) => (
          <div
            key={day}
            className="font-medium text-sm md:text-base lg:text-lg text-gray-500 py-2 md:py-3"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3 lg:gap-4">
        {calendarGrid.map((dayInfo, index) => {
          if (!dayInfo) {
            return <div key={`empty-${index}`} className="w-full h-12" />;
          }

          const dateObj = dayjs(dayInfo.date);
          let isInRange = false;
          if (mode === "full-day" && selectedStartDate && selectedEndDate) {
            const start = dayjs(selectedStartDate);
            const end = dayjs(selectedEndDate);
            isInRange =
              dateObj.isAfter(start, "day") && dateObj.isBefore(end, "day");
          }

          return (
            <div
              key={dayInfo.date}
              onClick={() =>
                !dayInfo.isDisabled && handleDateClick(dayInfo.date)
              }
              className={`w-full h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors relative ${
                dayInfo.isDisabled
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : isInRange
                  ? "bg-[#EBF8F4] text-gray-700"
                  : dayInfo.isSelected
                  ? "bg-[#FBE08C] text-black font-bold shadow-md"
                  : "bg-white text-gray-700 hover:bg-yellow-100"
              } ${
                dayInfo.isToday && !dayInfo.isSelected
                  ? "border-2 border-yellow-400"
                  : ""
              }`}
            >
              <span className="text-sm font-medium">{dayInfo.dayOfMonth}</span>
            </div>
          );
        })}
      </div>

      {getSelectedDatesDisplay() && (
        <div className="mt-6 flex justify-center">
          <div className="bg-[#EBF8F4] text-gray-800 px-6 py-3 rounded-full font-medium">
            {getSelectedDatesDisplay()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWithMode;
