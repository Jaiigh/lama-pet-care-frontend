"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatToThaiBuddhistDate, thaiDayShortNames } from "@/utils/thaiDate";
import CalendarDay from "@/components/reservation/CalendarDay";
import { DayInfo } from "@/interfaces/profileInterface";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const Calendar = () => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

    
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    router.push(`/reservation/create?date=${date}`);
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

      grid.push({
        date: dateString,
        dayOfMonth: day,
        isToday: date.isSame(today, "day"),
        isSelected: dateString === selectedDate,
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
        {calendarGrid.map((dayInfo, index) => (
          <CalendarDay
            key={dayInfo ? dayInfo.date : `empty-${index}`}
            dayInfo={dayInfo}
            onDateSelect={handleDateSelect}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            const token =
              localStorage.getItem("accessToken") ||
              localStorage.getItem("token");
            if (!token) {
              // Redirect to login page
              window.location.href = "/auth/login";
              return;
            }
            router.push("/reservation/my-bookings");
          }}
          className="bg-[#FBE08C] text-black font-bold py-3 px-8 rounded-2xl hover:bg-amber-400 transition-transform transform hover:scale-105"
        >
          การจองของฉัน
        </button>
      </div>
    </div>
  );
};

export default Calendar;
