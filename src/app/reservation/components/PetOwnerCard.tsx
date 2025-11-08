"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/images/empty-avatar.png";
import { getUser } from "@/utils/api";

interface Profile {
  name: string;
  telephone_number: string;
}

const PetOwnerCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
          console.error("กรุณาเข้าสู่ระบบก่อน");
          return;
        }

        const data = await getUser();
        setProfile({
          name: data.name || data.full_name || "User",
          telephone_number: data.telephone_number || data.phone_number || "N/A",
        });
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col gap-[10px] pt-[29.5px] px-[90px]">
      <Image src={Logo} alt="avatar" width={64} height={64} />
      <div className="text-gray-500 font-bold pt-[10px]">Pet Owner</div>
      <div className="text-2xl font-bold">
        {profile ? `${profile.name}` : "Loading..."}
      </div>
      <p className="text-sm mt-2">
        📇 {profile ? `${profile.name}` : "Loading..."}
      </p>
      <p className="text-sm">
        📞 {profile ? `${profile.telephone_number}` : "Loading..."}
      </p>
    </div>
  );
};

export default PetOwnerCard;
