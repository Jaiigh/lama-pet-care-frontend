"use client";

import { use, useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { getProfile, updateProfile } from "@/services/profileService";
import { s } from "framer-motion/client";

function PersonalInfo() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!storedToken) {
          console.error("กรุณาเข้าสู่ระบบก่อน");
          return;
        }

        const data = await getProfile();
        const profileData: Profile = {
          name: data.name ||  "User",
          user_id: data.user_id || "N/A",
          telephone_number: data.telephone_number  || "N/A",
          email: data.email || "N/A",
          created_at: data.created_at || "N/A",
          birth_date: data.birth_date || "N/A",
          address: data.address || "N/A",
        };
        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const info_items = [
    {
      id: 1,
      key: "name",
      label: "ชื่อนามสกุล",
      value: profile?.name || "loading...",
    },
    {
      id: 2,
      key: "user_id",
      label: "เลขประจำตัวผู้ใช้",
      value: 'LAMA-' + profile?.user_id || "loading...",
    },
    {
      id: 3,
      key: "telephone_number",
      label: "หมายเลขโทรศัพท์",
      value: profile?.telephone_number || "loading...",
    },
    {
      id: 4,
      key: "email",
      label: "อีเมล",
      value: profile?.email || "loading...",
    },
    {
      id: 5,
      key: "created_at",
      label: "วันที่สมัครสมาชิก",
      value: profile?.created_at.split('T')[0] || "loading...",
    },
    {
      id: 6,
      key: "birth_date",
      label: "วันเกิด",
      value: profile?.birth_date.split('T')[0] || "loading...",
    },
    {
      id: 7,
      key: "address",
      label: "ที่อยู่",
      value: profile?.address || "loading...",
    },
  ];

  const handleChange = async (key: keyof Profile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    setIsEditing(false);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("กรุณาเข้าสู่ระบบก่อน");
        return;
      }
    }catch (error) {
      console.error("Error updating profile:", error);
    }

      // Update profile via backend API
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      console.log("Profile updated successfully:", updatedProfile);
  };

  return (
    <div>
      <div className="pl-5 text-[#072568]">* ข้อมูลส่วนตัว</div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row flex-wrap items-center w-full h-auto py-[30px] px-0 pb-[30px] gap-[10px] bg-white border border-[#ccc] rounded-[15px]">
          {info_items.map((item) => (
            <div
              key={item.id}
              className="px-5 text-[#072568] flex-1 basis-[45%]"
            >
              <div className="pl-[10px] pb-[10px]">{item.label}</div>
              {isEditing ? (
                <input
                  className="bg-[#EAFFF9] w-full p-[10px] rounded-[10px]"
                  value={formData[item.key as keyof Profile] || ""}
                  onChange={(e) =>
                    handleChange(item.key as keyof Profile, e.target.value)
                  }
                />
              ) : (
                <div className="bg-[#EAFFF9] w-full p-[10px] rounded-[10px]">
                  {item.value}
                </div>
              )}
            </div>
          ))}
          {!isEditing && (
            <button
              type="button" // ป้องกัน submit
              className="bg-[#5AD5CC] text-white w-full p-[10px] rounded-[10px] ml-120 mt-5 mr-10"
              onClick={() => setIsEditing(true)}
            >
              แก้ไขโปรไฟล์
            </button>
          )}
          {isEditing && (
            <button
              type="submit" // Submit form
              className="bg-[#5AD5CC] text-white w-full p-[10px] rounded-[10px] ml-120 mt-5 mr-10"
            >
              ยืนยันการแก้ไข
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
