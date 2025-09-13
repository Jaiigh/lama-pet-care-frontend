"use client";

import TopProfile from "./top-profile/TopProfile";
import BodyProfile from "./body-profile/BodyProfile";

export default function Home() {
  return (
    <div className="max-w-full container mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <TopProfile />
      <BodyProfile />
    </div>
  );
}
