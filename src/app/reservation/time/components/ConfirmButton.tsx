"use client";

import { useState } from "react";
export default function ConfirmButton() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    return (
        <button
            onClick={() => setIsConfirmed(true)}
            className={`w-[240px] h-[60px] rounded-lg text-white font-medium mt-[20px] ${
                isConfirmed ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
            }`}
            disabled={isConfirmed}
        >
            {isConfirmed ? "ยืนยันแล้ว" : "ยืนยันการจอง"}
        </button>
    );
}