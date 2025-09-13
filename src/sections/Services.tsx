"use client";

import React from "react";
import Image from "next/image";
import PlusIcon from "@/assets/plus.svg";
import MinusIcon from "@/assets/minus.svg";
import clsx from "clsx";

const items = [
  {
    service: "บริการฝากเลี้ยง",
    info: "ควย",
  },
  {
    service: "บริการสัตวแพทย์",
    info: "หี",
  },
  {
    service: "บริการขายตัว",
    info: "หำ",
  },
  {
    service: "บริการอื่นๆ",
    info: "ดำ",
  },
];

const AccordionItem = ({
  service,
  info,
}: {
  service: string;
  info: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className="py-7 border-b border-black/30"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center">
        <span className="flex-1 text-lg font-bold">{service}</span>
        {isOpen ? (
          <Image src={MinusIcon} alt="Search Icon" className="" />
        ) : (
          <Image src={PlusIcon} alt="Search Icon" className="" />
        )}
      </div>
      <div
        className={clsx("mt-4", {
          hidden: !isOpen,
          "": isOpen == true,
        })}
      >
        {info}
      </div>
    </div>
  );
};

export const Services = () => {
  return (
    <div className="text-black py-[72px] sm:py-24 bg-[#F8F8F1]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-5xl text-center sm:text-6xl sm:max-w-[600px] mx-auto font-bold tracking-tighter">
          Services we will FUCKING provide
        </h2>
        <div className="mt-12 max-w-[648px] mx-auto">
          {items.map(({ service, info }) => (
            <AccordionItem key={service} service={service} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
};
