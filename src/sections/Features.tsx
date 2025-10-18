"use client";

import Image from "next/image";
import CalendarIcon from "@/assets/calendar.svg";
import HeartIcon from "@/assets/heart.svg";
import SearchIcon from "@/assets/search.svg";
import { Feature } from "./Feature";

const features = [
  {
    title: "ค้นหา",
    description: "ค้นหาบริการที่เหมาะกับคุณ",
    icon: SearchIcon,
  },
  {
    title: "จอง",
    description: "เลือกและทำการจองง่ายๆ",
    icon: CalendarIcon,
  },
  {
    title: "สบายใจ",
    description: "รับบริการอย่างสบายใจติดตามได้อย่างใกล้ชิด",
    icon: HeartIcon,
  },
];
//    <div className="text-black py-[72px] sm:py-24 bg-[radial-gradient(ellipse_200%_100%_at_top_left,#86c3ba,#F8F8F1_100%)]">

export const Features = () => {
  return (
    <div className="text-black py-[72px] sm:py-24 bg-[radial-gradient(ellipse_200%_100%_at_top_left,#86c3ba,#F8F8F1_100%)]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-center text-5xl font-bold tracking-tighter sm:text-6xl">
          ใช้งานง่ายๆ ใน 3 ขั้นตอน
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="text-center mt-5 text-xl text-[#010D3E]">
            คุณเลือกใช้บริการต่างๆได้ง่ายๆ เพียงไม่กี่คลิก ค้นหา จองวัน ตกลง
            ไม่ว่าจะเป็นอยู่เป็นเพื่อน ไปเดินสวนสาธารณะ รวมถึงพาไปพบแพทย์
            พร้อมดูรีวิวการทำงานของพนักงาน,
            ติดตามการทำงานและสัตว์เลี้ยงของคุณได้ตลอด
            มั่นใจได้เลยว่าพนักงานของเราทุกคนถูกฝึกมาอย่างดี
          </p>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-8 text-xl">
          {features.map(({ title, description, icon }) => (
            <Feature
              key={title}
              title={title}
              description={description}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
