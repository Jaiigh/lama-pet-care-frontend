"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export const Feature = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  const border = useRef<HTMLDivElement>(null);
  const offsetX = useMotionValue(-100);
  const offsetY = useMotionValue(-100);
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!border.current) return;
      const borderRect = border.current?.getBoundingClientRect();
      offsetX.set(e.x - borderRect.x);
      offsetY.set(e.y - borderRect.y);
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return (
    <div className="flex-1 basis-0 border border-black/30 px-5 py-10 text-center rounded-xl sm:flex-1 relative bg-white">
      <motion.div
        className="absolute inset-0 border-2 border-white-400 rounded-xl"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      ></motion.div>
      <div ref={border}></div>
      <div>
        <div className="inline-flex justify-center items-center bg-[#a7e5dc] rounded-full p-4 w-20 h-20">
          <Image
            src={icon}
            alt={`${title} Icon`}
            width={45}
            height={45}
            className="object-contain"
          />
        </div>
      </div>
      <h3 className="mt-6 font-bold">{title}</h3>
      <p className="mt-2 text-[#010D3E]">{description}</p>
    </div>
  );
};
