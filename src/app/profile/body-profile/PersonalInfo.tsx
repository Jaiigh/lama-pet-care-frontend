"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { getProfile, updateProfile } from "@/services/profileService";

function PersonalInfo() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "0917f704-f9e1-4d21-a940-8eb609242313"; // test user_id -> fix when auth is ready
        const data = await getProfile(userId);
        setProfile(data);
        setFormData(data);
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
      value: profile?.user_id || "loading...",
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
      value: profile?.created_at || "loading...",
    },
    {
      id: 6,
      key: "birth_date",
      label: "วันเกิด",
      value: profile?.birth_date || "loading...",
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
    const userId = "0917f704-f9e1-4d21-a940-8eb609242313"; // test user_id -> fix when auth is ready
    const updated = await updateProfile(userId, formData);
    setProfile(updated);
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
                  {profile?.[item.key as keyof Profile] || "loading..."}
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
