"use client";

import React from "react";
import { CalendarRange, Clock } from "lucide-react";
import { ReservationMode } from "@/interfaces/reservationFlowInterface";

interface ModeSelectionProps {
  selectedMode: ReservationMode | null;
  onModeSelect: (mode: ReservationMode) => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        เลือกรูปแบบการจอง
      </h2>
      <p className="text-gray-600 mb-6">
        เลือกรูปแบบการจองที่คุณต้องการ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full-day Option */}
        <button
          onClick={() => onModeSelect("full-day")}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedMode === "full-day"
              ? "border-[#61C5AA] bg-[#EBF8F4] shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                selectedMode === "full-day"
                  ? "bg-[#61C5AA] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <CalendarRange size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                Full-day (multi-day stay)
              </h3>
              <p className="text-sm text-gray-600">
                จองทั้งวันหลายวัน
              </p>
            </div>
          </div>
        </button>

        {/* Within-day Option */}
        <button
          onClick={() => onModeSelect("within-day")}
          className={`p-6 rounded-xl border-2 transition-all ${
            selectedMode === "within-day"
              ? "border-[#61C5AA] bg-[#EBF8F4] shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                selectedMode === "within-day"
                  ? "bg-[#61C5AA] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Clock size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                Within-day (hourly)
              </h3>
              <p className="text-sm text-gray-600">
                จองเป็นรายชั่วโมงภายในวัน
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
