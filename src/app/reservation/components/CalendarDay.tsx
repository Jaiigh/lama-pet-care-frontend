"use client";
import React from "react";
import { DayInfo } from "@/interfaces/profileInterface";

interface CalendarDayProps {
  dayInfo: DayInfo | null;
  onDateSelect: (date: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ dayInfo, onDateSelect }) => {
  if (!dayInfo) {
    return <div className="w-full h-12" />;
  }

  const { date, dayOfMonth, isToday, isSelected, hasBooking, isDisabled } =
    dayInfo;

  const handleSelect = () => {
    if (!isDisabled && date) {
      onDateSelect(date);
    }
  };

  const cellClasses = [
    "w-full h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors relative group",
    isDisabled ? "text-gray-300 cursor-not-allowed" : "text-gray-700",
    isSelected ? "bg-[#FBE08C] text-black font-bold shadow-md" : "bg-white",
    !isDisabled && !isSelected ? "hover:bg-yellow-100" : "",
    isToday && !isSelected ? "border-2 border-yellow-400" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cellClasses}
      onClick={handleSelect}
      aria-label={`Select ${dayOfMonth}`}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
    >
      <span className="text-sm font-medium">{dayOfMonth}</span>
      {hasBooking && (
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-1.5"></div>
      )}
    </div>
  );
};

export default CalendarDay;
