"use client";

import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Features } from "@/sections/Features";
import { Services } from "@/sections/Services";
import { CallToAction } from "@/sections/CallToAction";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Services />
      <CallToAction />
    </>
  );
}
