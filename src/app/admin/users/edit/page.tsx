"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect, Suspense, useMemo } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { Pet } from "@/interfaces/petInterface";
import { useSearchParams } from "next/navigation";
import { getProfileByAdmin, updateProfileByAdmin, getPetByAdminUsingOwnerId, addPetByAdmin,deletePetByAdmin } from "@/services/adminService";

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState<string | null>(null);

  // Add state for new pet form
  const [newPet, setNewPet] = useState<Partial<Pet>>({});
  const [isAddingPet, setIsAddingPet] = useState(false);

  // Add state for modal visibility
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId && token) {
        setPetsLoading(true);
        setPetsError(null);
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

          // try to read pets from admin profile response if available
          const fetchedPets = await getPetByAdminUsingOwnerId(userId, token);
          setPets(Array.isArray(fetchedPets?.data.pets) ? fetchedPets.data.pets : []);
          console.log("Fetched pets:", fetchedPets.data.pets);
        } catch (err) {
          console.error("fetchProfile error:", err);
          setPetsError("ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้");
        } finally {
          setPetsLoading(false);
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


  // Modal component
  const AddPetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [newPet, setNewPet] = useState<Partial<Pet>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNewPetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewPet((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: value ? "" : "This field is required" }));
    };

    // Debug and fix validation logic and button state
    const isFormValid = useMemo(() => {
      const requiredFields: (keyof Pet)[] = [
        "breed",
        "name",
        "birth_date",
        "weight",
        "kind",
        "sex",
      ];
      const newErrors: Record<string, string> = {};

      requiredFields.forEach((field) => {
        if (!newPet[field] || newPet[field]?.toString().trim() === "") {
          newErrors[field] = "This field is required";
        }
      });

      setErrors(newErrors);
      console.log("Validation errors:", newErrors); // Debug log
      return Object.keys(newErrors).length === 0;
    }, [newPet]);

    const handleAddPet = async () => {
      console.log("Attempting to add pet", newPet); // Debug log
      if (!isFormValid) {
        console.error("Form is invalid", errors); // Debug log
        return;
      }
      if (!userId || !token) {
        console.error("Missing userId or token"); // Debug log
        return;
      }
      try {
        const addedPet = await addPetByAdmin(newPet, token, userId);
        setPets((prev) => [...prev, addedPet]);
        onClose();
      } catch (err) {
        console.error("Error adding pet:", err);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-25 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-lg font-semibold mb-4">เพิ่มสัตว์เลี้ยง</h2>
          <div className="space-y-4">
            {/*
              { label: "ชื่อสัตว์เลี้ยง", name: "name" },
              { label: "รหัสสัตว์เลี้ยง", name: "pet_id" },
              { label: "รหัสเจ้าของ", name: "owner_id" },
              { label: "สายพันธุ์", name: "breed" },
              { label: "วันเกิด", name: "birth_date", type: "date" },
              { label: "น้ำหนัก", name: "weight", type: "number" },
              { label: "ชนิด", name: "kind" },
              { label: "เพศ", name: "sex", type: "select" },
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อสัตว์เลี้ยง</label>
              <input
                type="text"
                name="name"
                value={newPet.name ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">รหัสเจ้าของ</label>
              <input
                type="text"
                name="owner_id"
                value={userId || ""}
                disabled={true}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">สายพันธุ์</label>
              <input
                type="text"
                name="breed"
                value={newPet.breed ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              {errors.breed && <p className="text-red-500 text-sm mt-1">{errors.breed}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">วันเกิด</label>
              <input
                type="date"
                name="birth_date"
                value={newPet.birth_date ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">น้ำหนัก</label>
              <input
                type="text"
                name="weight"
                value={newPet.weight ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ชนิด</label>
              <input
                type="text"
                name="kind"
                value={newPet.kind ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              {errors.kind && <p className="text-red-500 text-sm mt-1">{errors.kind}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">เพศ</label>
              <select
                name="sex"
                value={newPet.sex ?? ""}
                onChange={handleNewPetChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="unknown">ไม่ทราบ</option>
              </select>
              {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={handleAddPet}
              disabled={!isFormValid}
              className={`bg-teal-500 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
              }`}
            >
              บันทึก
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeletePet = async (petId: string) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this pet?");
      if (!confirmed) return;

      // Call the API to delete the pet
      await deletePetByAdmin(petId,token ||"");

      // Refetch or update the pet list after deletion
      setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId));
    } catch (error) {
      console.error("Failed to delete pet:", error);
    }
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
        {/* Pets section */}
        <div className="mt-6">
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-sm font-semibold text-gray-700 mb-4">สัตว์เลี้ยง</legend>
            {petsLoading ? (
              <p>กำลังโหลดข้อมูลสัตว์เลี้ยง...</p>
            ) : petsError ? (
              <p className="text-red-500">{petsError}</p>
            ) : pets && pets.length > 0 ? (
              <div className="space-y-4">
                {pets.map((p) => (
                  <fieldset key={p.pet_id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">ชื่อสัตว์เลี้ยง</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.name || "-"}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสสัตว์เลี้ยง</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.pet_id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">เจ้าของ (ID)</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.owner_id || "-"}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">สายพันธุ์</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.breed || "-"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ชนิด</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.kind || "-"}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">เพศ</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.sex || "-"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">น้ำหนัก</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{String(p.weight) || "-"}</p>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">วันเกิด</label>
                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2 text-sm">{p.birth_date || "-"}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDeletePet(p.pet_id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </fieldset>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">ไม่มีข้อมูลสัตว์เลี้ยง</p>
            )}
          </fieldset>

          {/* Add Pet section */}
          <div className="mt-4">
            <button
              onClick={() => setIsAddPetModalOpen(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-600"
            >
              เพิ่มสัตว์เลี้ยง
            </button>
          </div>
        </div>

        {/* Render AddPetModal */}
        <AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)} />
      </AdminShell>
    </div>
  );
}