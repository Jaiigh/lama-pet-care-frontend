"use client";

import { useState } from "react";

export default function TimeSlotPicker() {
  const slots = [
    { time: "08:00", disabled: true },
    { time: "09:00", disabled: false },
    { time: "10:00", disabled: false },
    { time: "11:00", disabled: false },
    { time: "13:00", disabled: false },
    { time: "14:00", disabled: false },
    { time: "15:00", disabled: true },
    { time: "16:00", disabled: false },
  ];

  const [selected, setSelected] = useState<string>("");

  return (
    <div>
      <label className="block mb-2 font-medium">3. เลือกช่วงเวลาที่ว่าง</label>
      <div className="flex flex-wrap gap-3">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => !slot.disabled && setSelected(slot.time)}
            disabled={slot.disabled}
            className={`px-4 py-2 rounded-lg border ${
              slot.disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : selected === slot.time
                ? "bg-teal-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}
