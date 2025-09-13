"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm">
        <p className="text-white/60 hidden md:block">
          Try convenient pet sitting with Lama
        </p>
        <Link href="/auth/signup" className="inline-flex gap-1 items-center">
          <p>Sign Up For Free</p>
        </Link>
      </div>
      <nav className="py-5 bg-white">
        <div className="container mx-auto px-5 lg:px-20">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Lama Logo" width={150} height={40} />
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link href="/pet-sitting" className="text-black/60">
                Pet Sitting
              </Link>
              <Link href="/reservations" className="text-black/60">
                Reservations
              </Link>
              <Link href="/reviews" className="text-black/60">
                Reviews
              </Link>
              <Link href="/profile" className="text-black/60">
                Profile
              </Link>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
