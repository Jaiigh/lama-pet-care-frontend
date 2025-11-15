"use client";

import Image from "next/image";
import Logo from "@/images/empty-avatar.png";

import { use, useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { getProfile } from "@/services/profileService";

import { Pet, PetsApiResponse } from "@/interfaces/profileInterface";
import { getMyPets } from "@/services/profileService";

import dayjs from 'dayjs';

function Display() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[] | null>(null);

  useEffect(() => {
        const fetchReservations = async () => {
          try {
            const response : Pet[] = await getMyPets();
            setPets(response);
          } catch (error) {
            console.error("Error fetching pets:", error);
          }
        };
        fetchReservations();
      }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("กรุณาเข้าสู่ระบบก่อน");
          return;
        }

        const data = await getProfile();
        const profileData: Profile = {
          name: data.name || "User",
          user_id: data.user_id || "N/A",
          telephone_number: data.telephone_number  || "N/A",
          email: data.email || "N/A",
          created_at: data.created_at || "N/A",
          birth_date: data.birth_date || "N/A",
          address: data.address || "N/A",
        };
        setProfile(profileData);
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
            <div>{(pets ?? []).length}</div>
            <div>สัตว์เลี้ยง</div>
          </div>
          <div className="text-center w-[45%] text-[#072568] bg-[#EAFFF9] px-[30px] py-[15px] rounded-[10px] text-sm">
            <div>{dayjs().diff(profile?.created_at, 'years')}</div>
            <div>ปีที่เป็นสมาชิก</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
