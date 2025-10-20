 "use client";

import { useState } from "react";

export default function ServiceSelector() {
 const [service, setService] = useState("บรืการ");

  return (
    <div className="space-y-4">
      <div>
        <label className="block mt-[18px] mb-[18px] font-medium">2. เลือกบริการ</label>
        <div className="dropdown w-[280px] h-[60px]">
            <select
            className="w-full h-full appearance-none focus:outline-none"
            value={service}
            onChange={(e) => setService(e.target.value)}
            >
            <option value="">บริการ</option>
            <option value="doctor">รักษาสัตว์เลี้ยง</option>
            <option value="caretaker">ดูแลสัตว์เลี้ยง</option>
            </select>
        </div>
      </div>
    </div>
  );
}