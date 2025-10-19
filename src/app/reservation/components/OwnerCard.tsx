"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CreditCard, Phone } from "lucide-react";
import { getUser } from "@/utils/api";

interface Profile {
  full_name: string;
  phone_number: string;
  email: string;
  // Add other profile fields as needed
}

const OwnerCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken") ||
              localStorage.getItem("token")
            : null;
        if (!token) {
          setError("กรุณาเข้าสู่ระบบก่อน");
          setLoading(false);
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
          return;
        }

        setError("");
        const data = await getUser();
        setProfile({
          full_name: data.full_name || data.name || "User",
          phone_number: data.phone_number || data.telephone_number || "N/A",
          email: data.email || "N/A",
        });
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
        setError(
          error instanceof Error ? error.message : "โหลดโปรไฟล์ไม่สำเร็จ"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="w-18 h-18 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="h-5 bg-gray-300 rounded w-36"></div>
            <div className="h-5 bg-gray-300 rounded w-36"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
        <p className="text-red-600">{error}</p>
        {/* Optionally, add a login button */}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
      <Image
        src="/assets/images/profile/top-profile/Frame_1171275857.png"
        alt="Pet Owner Avatar"
        width={72}
        height={72}
        className="rounded-full mb-4"
      />
      <p className="text-gray-600">Pet Owner</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1 mb-6">
        {profile?.full_name || "N/A"}
      </h3>

      <div className="space-y-4 text-left">
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 text-gray-700 mr-3" />
          <span className="text-gray-800">{profile?.email || "N/A"}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-gray-700 mr-3" />
          <span className="text-gray-800">
            {profile?.phone_number || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OwnerCard;
