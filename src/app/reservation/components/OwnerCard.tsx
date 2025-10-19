"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CreditCard, Phone } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  phone_number: string;
  // Add other profile fields as needed
}

const OwnerCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // 1. Fetch the current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // 2. Fetch the user's profile from the 'profiles' table
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // Fallback to user metadata if profile table fails
          setProfile({
            full_name: user.user_metadata.full_name || user.email || "User",
            phone_number: user.user_metadata.phone_number || "N/A",
          });
        } else {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchUserAndProfile();
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

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
        <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
        {/* Optionally, add a login button */}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center w-full max-w-md mx-auto">
      <Image
        src={
          user.user_metadata.avatar_url ||
          "/assets/images/profile/top-profile/Frame_1171275857.png"
        }
        alt="Pet Owner Avatar"
        width={72}
        height={72}
        className="rounded-full mb-4"
      />
      <p className="text-gray-600">Pet Owner</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1 mb-6">
        {profile?.full_name || user.user_metadata.full_name || "N/A"}
      </h3>

      <div className="space-y-4 text-left">
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 text-gray-700 mr-3" />
          <span className="text-gray-800">{user.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-gray-700 mr-3" />
          <span className="text-gray-800">
            {profile?.phone_number || user.user_metadata.phone_number || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OwnerCard;
