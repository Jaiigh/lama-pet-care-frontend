"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/images/lamalogo.png";
import ArrowRight from "@/assets/arrow-right.svg";
import Menu from "@/assets/menu.svg";

export const Header = () => {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/admin");

  if (hideHeader) {
    return null;
  }

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm">
        <p className="text-white/60 hidden md:block">
          Try convenient pet sitting with Lama
        </p>
        <div className="inline-flex gap-1 items center">
          <Image
            src={ArrowRight}
            alt="Arrow Right"
            className="h-4 w-4 inline-flex justify-center items-center"
            width={40}
            height={16}
          />
          <p>Sign Up For Free</p>
        </div>
      </div>
      <div className="py-5">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="pl-4 lg:pl-10">
              <Image src={Logo} alt="Lama Logo" height={100} width={100} />
            </div>
            <div className="pr-4 lg:pr-10">
              <Image
                src={Menu}
                alt="Menu"
                width={20}
                height={20}
                className="md:hidden"
              />
            </div>
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <Link href="/">Home</Link>
              <Link href="/pet-sitting">Pet Sitting</Link>
              <Link href="/reservation">Reservation</Link>
              <Link href="/reviews">Reviews</Link>
              <Link href="/profile">Profile</Link>
              <button className="btn btn-primary">Sign Up</button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
