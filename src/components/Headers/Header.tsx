"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Logo from "@/images/lamalogo.png";
import ArrowRight from "@/assets/arrow-right.svg";
import Menu from "@/assets/menu.svg";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/profileService";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const { isAuthed } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hideHeader = pathname?.startsWith("/admin");

  useEffect(() => {
    if (hideHeader) return;
    const fetchUsername = async () => {
      if (isAuthed) {
        try {
          const profile = await getProfile();
          setUsername(profile.name);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setUsername(null);
      }
    };

    fetchUsername();
  }, [isAuthed, hideHeader]);

  useEffect(() => {
    if (hideHeader) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, hideHeader]);

  const handleLogout = () => {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.removeItem("token");
      globalThis.window.localStorage.removeItem("accessToken");
      globalThis.window.localStorage.removeItem("user_id");
      globalThis.window.localStorage.removeItem("role");

      globalThis.window.dispatchEvent(new CustomEvent("auth-changed"));

      // Redirect to home page
      globalThis.window.location.href = "/";
    }
  };

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
              {isAuthed && username ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#76D8B1] text-white font-semibold px-5 py-2.5 rounded-2xl hover:bg-[#5fc49f] transition-all cursor-pointer focus:outline-none shadow-lg border-2 border-[#76D8B1] hover:border-[#5fc49f]"
                    style={{
                      backgroundColor: "#76D8B1",
                      color: "#ffffff",
                      borderColor: "#76D8B1",
                      boxShadow:
                        "0 4px 6px -1px rgba(118, 216, 177, 0.3), 0 2px 4px -1px rgba(118, 216, 177, 0.2)",
                    }}
                  >
                    <span className="text-white font-semibold">{username}</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/register" className="btn btn-primary">
                  Sign Up
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
