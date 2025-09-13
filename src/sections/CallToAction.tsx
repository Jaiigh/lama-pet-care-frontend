"use client";

import Image from "next/image";
import helixImage from "@/images/helix2.png";
import emojiStarImage from "@/images/emojistar.png";
import { useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    scrollYProgress.on("change", (value) => console.log("value", value));
  }, []);

  const translateY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <div
      ref={containerRef}
      className="bg-black text-white py-[72px] pb-[200px] sm:py-24 sm:pb-[300px] text-center overflow-x-clip"
    >
      <div className="container mx-auto px-4 max-w-xl relative">
        <motion.div style={{ translateY }}>
          <Image
            src={helixImage}
            alt="Helix"
            className="absolute top-6 left-[calc(100%+36px)] "
          />
        </motion.div>
        <motion.div style={{ translateY }}>
          <Image
            src={emojiStarImage}
            alt="Emoji Star"
            className="absolute -top-[120px] right-[calc(100%+24px)]"
          />
        </motion.div>

        <h2 className="font-bold text-5xl tracking-tighter sm:text-6xl">
          Sign up for free
        </h2>
        <p className="text-xl text-white/70 mt-5">
          พร้อมมอบสิ่งที่ดีที่สุดให้ลูกรักของคุณแล้วหรือยัง?
        </p>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn bg-black text-white border border-white">
            Sign up
          </button>
          <button className="btn bg-white text-black border border-black">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};
