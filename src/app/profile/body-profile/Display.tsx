"use client";

import Image from "next/image";
import Logo from "@/images/empty-avatar.png";

import { useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { supabase } from "@/utils/supabase/client";

function Display() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user from Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Fetch profile from Supabase profiles table
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            // Fallback to user metadata
            const fallbackProfile: Profile = {
              name: user.user_metadata.full_name || user.email || "User",
              user_id: user.id,
              telephone_number: user.user_metadata.phone_number || "N/A",
              email: user.email || "N/A",
              created_at: user.created_at || "N/A",
              birth_date: user.user_metadata.birth_date || "N/A",
              address: user.user_metadata.address || "N/A",
            };
            setProfile(fallbackProfile);
          } else {
            const profileData: Profile = {
              name: data.full_name || user.user_metadata.full_name || "User",
              user_id: user.id,
              telephone_number:
                data.phone_number || user.user_metadata.phone_number || "N/A",
              email: user.email || "N/A",
              created_at: user.created_at || "N/A",
              birth_date:
                data.birth_date || user.user_metadata.birth_date || "N/A",
              address: data.address || user.user_metadata.address || "N/A",
            };
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-auto py-[30px] px-0 pb-[50px] mt-[23px] gap-[50px] bg-white border border-[#ccc] rounded-[15px]">
      <div className="flex items-center flex-col gap-[10px]">
        <Image src={Logo} alt="avatar" width={120} height={120} />
        <div>{profile?.name || "loading..."}</div>
      </div>
      <div className="flex flex-col gap-5 w-[80%]">
        <div className="text-left bg-[#A7E5DC] inline-block w-fit px-[15px] py-[2px] pl-[10px] rounded-[20px] text-sm">
          * Pet Owner
        </div>
        <div className="flex flex-row flex-wrap gap-[10px]">
          <div className="text-center w-[45%] text-[#072568] bg-[#EAFFF9] px-[30px] py-[15px] rounded-[10px] text-sm">
            <div>X</div>
            <div>สัตว์เลี้ยง</div>
          </div>
          <div className="text-center w-[45%] text-[#072568] bg-[#EAFFF9] px-[30px] py-[15px] rounded-[10px] text-sm">
            <div>X</div>
            <div>บริการที่ใช้</div>
          </div>
          <div className="text-center w-[45%] text-[#072568] bg-[#EAFFF9] px-[30px] py-[15px] rounded-[10px] text-sm">
            <div>X</div>
            <div>ปีที่เป็นสมาชิก</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
