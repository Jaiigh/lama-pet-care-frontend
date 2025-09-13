"use client";

import Image from "next/image";
import Logo from "@/images/empty-avatar.png";
import { use, useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { getProfile } from "@/services/profileService";

function Display() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "0917f704-f9e1-4d21-a940-8eb609242313"; // test user_id -> fix when auth is ready
        const data = await getProfile(userId);
        setProfile(data);
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
      <button className="bg-[#A7E5DC] px-[50px] py-[5px] pl-[45px] rounded-[20px]">
        * แก้ไขโปรไฟล์
      </button>
    </div>
  );
}

export default Display;
