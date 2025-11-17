"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchAdminServices as apiFetchAdminServices,
  updateAdminService as apiUpdateAdminService,
  updateServiceStatus as apiUpdateServiceStatus,
  fetchOwnerNamesMap,
  fetchPetNamesMap,
  fetchStaffNamesMap,
  normalizeServiceCollection,
  AdminService,
  fetchAllOwners,
  fetchAllPets,
  fetchAllStaff,
  fetchPetsByOwnerId,
  fetchPetNameByPetId,
  OwnerOption,
  PetOption,
  StaffOption,
} from "@/services/adminServiceApi";

export default function EditServicePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditServiceContent />
    </Suspense>
  );
}

function EditServiceContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [formData, setFormData] = useState({
    id: "",
    owner_id: "",
    pet_id: "",
    staff_id: "",
    reserve_date_start: "",
    reserve_date_end: "",
    service_type: "",
    comment: "",
    score: "",
    status: "wait" as "wait" | "ongoing" | "finish",
    owner_name: "",
    pet_name: "",
    staff_name: "",
    created_at: "",
  });

  // Store original form data to compare changes
  const [originalFormData, setOriginalFormData] = useState<
    typeof formData | null
  >(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [pets, setPets] = useState<PetOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [selectedOwnerName, setSelectedOwnerName] = useState<string>("");
  const [selectedPetName, setSelectedPetName] = useState<string>("");
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");

  const fetchService = useCallback(async () => {
    if (!serviceId || !token) {
      setLoading(false);
      return;
    }

    try {
      const json = await apiFetchAdminServices(token, { limit: 1000 });
      const services = normalizeServiceCollection(json);
      const service = services.find((s) => s.id === serviceId);

      if (service) {
        // Enrich owner, pet, and staff names for edit view
        // For pet: use PETID to fetch name directly from Pet table via owner
        const [ownerMap, petName, staffMap] = await Promise.all([
          fetchOwnerNamesMap(token, [service.owner_id]),
          fetchPetNameByPetId(token, service.pet_id, service.owner_id),
          fetchStaffNamesMap(token, [service.staff_id]),
        ]);

        const resolvedOwnerName =
          ownerMap[service.owner_id] || service.owner_name || "Unknown";
        const resolvedPetName = petName || service.pet_name || "Unknown";
        const resolvedStaffName =
          staffMap[service.staff_id] || service.staff_name || "Unknown";

        setFormData({
          id: service.id,
          owner_id: service.owner_id,
          pet_id: service.pet_id,
          staff_id: service.staff_id,
          reserve_date_start: service.reserve_date_start,
          reserve_date_end: service.reserve_date_end,
          service_type: service.service_type,
          comment: service.comment,
          score: String(service.score),
          status: service.status,
          owner_name: resolvedOwnerName,
          pet_name: resolvedPetName,
          staff_name: resolvedStaffName,
          created_at: service.created_at,
        });
        // Set selected names for dropdowns (will be set after options are loaded)
        // Store in formData first, then set in useEffect when owners are ready
      } else {
        setError("ไม่พบบริการที่ต้องการแก้ไข");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลบริการได้"
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId, token]);

  // Load options for dropdowns
  const loadOptions = useCallback(async () => {
    if (!token) return;
    setLoadingOptions(true);
    try {
      const [ownersData, staffData] = await Promise.all([
        fetchAllOwners(token),
        fetchAllStaff(token),
      ]);
      setOwners(ownersData);
      setStaff(staffData);
      // Don't load all pets here, will load when owner is selected
      setPets([]);
    } catch (err) {
      console.error("Error loading options:", err);
    } finally {
      setLoadingOptions(false);
    }
  }, [token]);

  // Load pets when owner is selected
  const loadPetsForOwner = useCallback(
    async (ownerId: string) => {
      if (!token || !ownerId) {
        setPets([]);
        return;
      }
      setLoadingOptions(true);
      try {
        const petsData = await fetchPetsByOwnerId(token, ownerId);
        setPets(petsData);
      } catch (err) {
        console.error("Error loading pets for owner:", err);
        setPets([]);
      } finally {
        setLoadingOptions(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchService();
    // Load options when component mounts
    loadOptions();
  }, [fetchService, loadOptions]);

  // Set selected names when owners/pets/staff are loaded and formData is ready
  useEffect(() => {
    if (formData.owner_name && owners.length > 0 && !selectedOwnerName) {
      // Check if owner name exists in owners list
      const ownerExists = owners.some((o) => o.name === formData.owner_name);
      if (ownerExists) {
        setSelectedOwnerName(formData.owner_name);
        // Load pets for this owner
        const owner = owners.find((o) => o.name === formData.owner_name);
        if (owner) {
          loadPetsForOwner(owner.id);
        }
      }
    }
    if (formData.staff_id && staff.length > 0 && !selectedStaffName) {
      // Try to find staff name from staff list
      const staffMember = staff.find((s) => s.id === formData.staff_id);
      if (staffMember) {
        setSelectedStaffName(staffMember.name);
      }
    }
  }, [
    formData.owner_name,
    formData.staff_id,
    owners,
    staff,
    selectedOwnerName,
    selectedStaffName,
    loadPetsForOwner,
  ]);

  // Set selected pet name after pets are loaded
  useEffect(() => {
    if (formData.pet_name && pets.length > 0 && !selectedPetName) {
      // Check if pet name exists in pets list
      const petExists = pets.some((p) => p.name === formData.pet_name);
      if (petExists) {
        setSelectedPetName(formData.pet_name);
      }
    }
  }, [formData.pet_name, pets, selectedPetName]);

  // Load pets when owner is selected
  useEffect(() => {
    if (selectedOwnerName && owners.length > 0) {
      const selectedOwner = owners.find((o) => o.name === selectedOwnerName);
      if (selectedOwner) {
        loadPetsForOwner(selectedOwner.id);
      }
    }
  }, [selectedOwnerName, owners, loadPetsForOwner]);

  // Pets are already filtered by owner when loaded, so use pets directly
  const filteredPets = pets;

  // Filter staff by service type
  const filteredStaff = useMemo(() => {
    if (!formData.service_type) return [];
    // mservice → doctor, cservice → caretaker
    const requiredRole =
      formData.service_type === "mservice" ? "doctor" : "caretaker";
    return staff.filter((s) => s.role === requiredRole);
  }, [staff, formData.service_type]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (
    newStatus: "wait" | "ongoing" | "finish"
  ) => {
    if (!token || !serviceId) return;

    setSaving(true);
    setError(null);

    try {
      await apiUpdateServiceStatus(token, serviceId, newStatus);
      setFormData((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถอัปเดตสถานะได้");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !serviceId) return;

    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.owner_id || !formData.pet_id || !formData.staff_id) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      // Build payload according to Swagger specification
      // Don't include service_type as it's not in Swagger and may cause backend issues
      const payload: Record<string, unknown> = {
        owner_id: formData.owner_id,
        pet_id: formData.pet_id,
        staff_id: formData.staff_id,
        reserve_date_start: formData.reserve_date_start,
        reserve_date_end: formData.reserve_date_end,
        comment: formData.comment || "",
        score: formData.score ? Number(formData.score) : 0,
        status: formData.status,
      };

      console.log("handleSubmit - Payload before sending:", payload);
      console.log("handleSubmit - Original data:", originalFormData);
      await apiUpdateAdminService(token, serviceId, payload);
      setError(null);
      // Reload service data after successful update
      setLoading(true);
      await fetchService();
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Services" description="จัดการบริการ">
        <p>กำลังโหลด...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Services" description="จัดการบริการ">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        แก้ไขบริการ
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form
        className="space-y-6 rounded-lg bg-white p-6 shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Service Info Section */}
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-sm font-semibold text-gray-700 mb-4">
            *ข้อมูลบริการ
          </legend>
          <div className="grid grid-cols-2 gap-4">
            {/* Owner Selection (when editing) */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="font-semibold">ชื่อเจ้าของ</span>
                  <span className="ml-2 text-xs text-gray-500">(Owner)</span>
                </label>
                <select
                  value={selectedOwnerName}
                  onChange={(e) => {
                    setSelectedOwnerName(e.target.value);
                    const owner = owners.find((o) => o.name === e.target.value);
                    if (owner) {
                      setFormData((prev) => ({ ...prev, owner_id: owner.id }));
                      setSelectedPetName(""); // Clear pet when owner changes
                      setFormData((prev) => ({ ...prev, pet_id: "" }));
                      // Load pets for selected owner
                      loadPetsForOwner(owner.id);
                    }
                  }}
                  disabled={loadingOptions}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">
                    {loadingOptions ? "กำลังโหลด..." : "-- เลือกชื่อเจ้าของ --"}
                  </option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.name}>
                      {owner.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อเจ้าของ
                </label>
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.owner_name || "N/A"}
                </p>
              </div>
            )}

            {/* Pet Selection (when editing) */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="font-semibold">ชื่อสัตว์เลี้ยง</span>
                  <span className="ml-2 text-xs text-gray-500">(Pet)</span>
                </label>
                <select
                  value={selectedPetName}
                  onChange={(e) => {
                    setSelectedPetName(e.target.value);
                    const pet = filteredPets.find(
                      (p) => p.name === e.target.value
                    );
                    if (pet) {
                      setFormData((prev) => ({ ...prev, pet_id: pet.id }));
                    }
                  }}
                  disabled={loadingOptions || !selectedOwnerName}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingOptions
                      ? "กำลังโหลด..."
                      : !selectedOwnerName
                      ? "กรุณาเลือกเจ้าของก่อน"
                      : filteredPets.length === 0
                      ? "ไม่พบสัตว์เลี้ยง"
                      : "-- เลือกชื่อสัตว์เลี้ยง --"}
                  </option>
                  {filteredPets.map((pet) => (
                    <option key={pet.id} value={pet.name}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อสัตว์เลี้ยง
                </label>
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.pet_name || "N/A"}
                </p>
              </div>
            )}

            {/* Owner ID - Read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner ID
              </label>
              <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                {formData.owner_id || "N/A"}
              </p>
            </div>

            {/* Pet ID - Read-only */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pet ID
                </label>
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.pet_id || "N/A"}
                </p>
              </div>
            )}

            {/* Service Type - Must be selected before staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ประเภทบริการ
              </label>
              {isEditing ? (
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={(e) => {
                    handleChange(e);
                    // Clear staff selection when service type changes
                    setSelectedStaffName("");
                    setFormData((prev) => ({ ...prev, staff_id: "" }));
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">-- เลือกประเภทบริการ --</option>
                  <option value="mservice">mservice</option>
                  <option value="cservice">cservice</option>
                </select>
              ) : (
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.service_type || "N/A"}
                </p>
              )}
            </div>

            {/* Staff Selection (when editing) - Filtered by service type */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="font-semibold">ชื่อสตาฟ</span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Staff/Caretaker/Doctor)
                  </span>
                </label>
                <select
                  value={selectedStaffName}
                  onChange={(e) => {
                    setSelectedStaffName(e.target.value);
                    const staffMember = filteredStaff.find(
                      (s) => s.name === e.target.value
                    );
                    if (staffMember) {
                      setFormData((prev) => ({
                        ...prev,
                        staff_id: staffMember.id,
                      }));
                    }
                  }}
                  disabled={loadingOptions || !formData.service_type}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingOptions
                      ? "กำลังโหลด..."
                      : !formData.service_type
                      ? "กรุณาเลือกประเภทบริการก่อน"
                      : filteredStaff.length === 0
                      ? "ไม่พบสตาฟสำหรับประเภทบริการนี้"
                      : "-- เลือกชื่อสตาฟ --"}
                  </option>
                  {filteredStaff.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Staff ID
                </label>
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.staff_id || "N/A"}
                </p>
              </div>
            )}

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                วันเริ่มต้น
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="reserve_date_start"
                  value={formData.reserve_date_start}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.reserve_date_start || "N/A"}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                วันสิ้นสุด
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="reserve_date_end"
                  value={formData.reserve_date_end}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
                />
              ) : (
                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                  {formData.reserve_date_end || "N/A"}
                </p>
              )}
            </div>

            {/* Score - Read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                คะแนน
              </label>
              <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                {formData.score || "0"}
              </p>
            </div>
          </div>

          {/* Comment */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              ความเห็น
            </label>
            {isEditing ? (
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
                rows={4}
              />
            ) : (
              <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                {formData.comment || "N/A"}
              </p>
            )}
          </div>
        </fieldset>

        {/* Status Management */}
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-sm font-semibold text-gray-700 mb-4">
            *สถานะ
          </legend>
          <div className="flex items-center gap-4">
            <label htmlFor="status" className="sr-only">
              สถานะ
            </label>
            {isEditing ? (
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-500 focus:ring-teal-100 disabled:opacity-50"
              >
                <option value="wait">รอดำเนินการ</option>
                <option value="ongoing">กำลังดำเนินการ</option>
                <option value="finish">เสร็จสิ้น</option>
              </select>
            ) : (
              <p className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {formData.status === "wait"
                  ? "รอดำเนินการ"
                  : formData.status === "ongoing"
                  ? "กำลังดำเนินการ"
                  : "เสร็จสิ้น"}
              </p>
            )}
            {saving && (
              <div className="text-sm text-gray-500">กำลังบันทึก...</div>
            )}
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
            >
              แก้ไข
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-teal-600 px-6 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
