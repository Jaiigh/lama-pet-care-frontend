"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { useSearchParams } from "next/navigation";
import getProfileByAdmin from "@/services/adminService";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

export default function EditUserPage() {
  const { token, profile: adminProfile, loading: sessionLoading } = useAdminSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    phone: "",
    email: "",
    registrationDate: "",
    birthDate: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false); // State สำหรับควบคุมโหมดการแก้ไข

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId && token) {
        const data = await getProfileByAdmin(userId, token);
        setFormData({
          name: data.name || "User",
          userId: data.user_id || "N/A",
          phone: data.telephone_number || "N/A",
          email: data.email || "N/A",
          registrationDate: data.created_at || "N/A",
          birthDate: data.birth_date || "N/A",
          address: data.address || "N/A",
        });
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    // เพิ่มฟังก์ชันการส่งข้อมูลไปยังเซิร์ฟเวอร์ที่นี่
  };

  return (
    <div>
      <AdminShell title="Users" description="จัดการรายชื่อผู้ใช้งานและสิทธิการเข้าถึงระบบ">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">แก้ไขผู้ใช้งาน</h1>
        <form className="bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-sm font-semibold text-gray-700 mb-4">*ข้อมูลส่วนตัว</legend>
            <div className="grid grid-cols-2 gap-4">
              {/* ชื่อ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.name}</p>
                )}
              </div>
              {/* เลขประจำตัวผู้ใช้ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">เลขประจำตัวผู้ใช้</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.userId}</p>
                )}
              </div>
              {/* หมายเลขโทรศัพท์ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">หมายเลขโทรศัพท์</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.phone}</p>
                )}
              </div>
              {/* อีเมล */}
              <div>
                <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.email}</p>
                )}
              </div>
              {/* ที่อยู่ */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    rows={3}
                  ></textarea>
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.address}</p>
                )}
              </div>
            </div>
          </fieldset>
          <div className="mt-6 flex justify-end">
            {isEditing ? (
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                บันทึกข้อมูล
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)} // เปลี่ยนโหมดเป็นแก้ไข
                className="bg-teal-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                แก้ไขข้อมูล
              </button>
            )}
          </div>
        </form>
      </AdminShell>
    </div>
  );
}