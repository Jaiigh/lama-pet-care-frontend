 "use client";

import { useState } from "react";

export default function PetSelector() {
 const [pet, setPet] = useState("สัตว์เลี้ยง");

  return (
    <div className="space-y-4">
      <div>
        <label className="block mt-[18px] mb-[18px] font-medium">1. เลือกสัตว์เลี้ยง</label>
        <div className="dropdown w-[280px] h-[60px]">
            <select
            className="w-full h-full appearance-none focus:outline-none"
            value={pet}
            onChange={(e) => setPet(e.target.value)}
            >
            <option value="">สัตว์เลี้ยง</option>
            <option value="dog">สุนัข</option>
            <option value="cat">แมว</option>
            </select>
        </div>
      </div>
    </div>
  );
}