"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect, Suspense } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { useSearchParams } from "next/navigation";
import { getProfileByAdmin, updateProfileByAdmin } from "@/services/adminService";

export default function EditUserPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditUserContent />
    </Suspense>
  );
}

function EditUserContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    phone: "",
    email: "",
    registrationDate: "",
    birthDate: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId && token) {
        try {
          const data = await getProfileByAdmin(userId, token);
          console.log(data);
          setFormData({
            name: data?.data?.name || "User",
            userId: data?.data?.user_id || "N/A",
            phone: data?.data?.telephone_number || "N/A",
            email: data?.data?.email || "N/A",
            registrationDate: data?.data?.created_at || "N/A",
            birthDate: data?.data?.birth_date || "N/A",
            address: data?.data?.address || "N/A",
          });
        } catch (err) {
          console.error("fetchProfile error:", err);
        }
      }
    };
    fetchProfile();
  }, [userId, token]);

  // save function (called when clicking button while in edit mode)
  const handleSave = async () => {
    if (isSubmitting) return;
    if (!userId || !token) {
      console.error("Missing userId or token");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfileByAdmin(userId, formData, token);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <AdminShell title="Users" description="จัดการรายชื่อผู้ใช้งานและสิทธิการเข้าถึงระบบ">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">แก้ไขผู้ใช้งาน</h1>
        <form className="bg-white shadow-md rounded-lg p-6" onSubmit={(e) => e.preventDefault()}>
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
                  />
                ) : (
                  <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{formData.address}</p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!isEditing) {
                  setIsEditing(true);
                } else {
                  handleSave();
                }
              }}
              disabled={isSubmitting}
              className={`bg-teal-500 text-white px-6 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
              }`}
            >
              {isEditing ? (isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล") : "แก้ไขข้อมูล"}
            </button>
          </div>
        </form>
      </AdminShell>
    </div>
  );
}