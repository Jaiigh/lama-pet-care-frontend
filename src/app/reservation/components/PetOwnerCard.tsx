"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/images/lamalogo.png";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  name: string;
  telephone_number: string;
}

const PetOwnerCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user first
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch profile from Supabase profiles table
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, phone_number")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            // Fallback to user metadata
            setProfile({
              name: user.user_metadata.full_name || user.email || "User",
              telephone_number: user.user_metadata.phone_number || "N/A",
            });
          } else {
            setProfile({
              name: data.full_name || user.user_metadata.full_name || "User",
              telephone_number:
                data.phone_number || user.user_metadata.phone_number || "N/A",
            });
          }
        }
      } catch (error) {
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
