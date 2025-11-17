/* eslint-disable @typescript-eslint/no-explicit-any */

import { environment } from "@/env/environment";

const API_BASE = environment.masterUrl;

function ensureApiBase() {
  if (!API_BASE) {
    throw new Error("API base URL is not configured");
  }
  return API_BASE;
}

async function toJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function buildError(response: Response, fallback: string) {
  const data = await toJson(response);
  const message = typeof data?.message === "string" ? data.message : fallback;
  const error = new Error(message);
  (error as { code?: number }).code = response.status;
  return error;
}

export async function fetchAdminServices(
  token: string,
  params: { page?: number; limit?: number; status?: string; month?: number; year?: number } = {},
) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.month) search.set("month", String(params.month));
  if (params.year) search.set("year", String(params.year));

  // Try public /services first (per Swagger), then admin-scoped if available
  const endpoints = [`${ensureApiBase()}/services`, `${ensureApiBase()}/admin/services`];
  let lastError: unknown = null;

  for (const base of endpoints) {
    const url = `${base}?${search.toString()}`;
    try {
      console.log("fetchAdminServices →", url);
    } catch {}
    const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

    if (response.ok) {
      const json = await toJson(response);
      // Return the most likely payload container
      const data = json?.data ?? json;
      return data;
    }

    lastError = await buildError(response, "ไม่สามารถโหลดข้อมูลบริการจาก API ได้");
    // If 404, try next endpoint; otherwise break
    if ((lastError as { code?: number }).code !== 404) {
      break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("ไม่สามารถโหลดข้อมูลบริการจาก API ได้");
}

export async function createAdminService(token: string, payload: Record<string, unknown>) {
  // Ensure all required fields are present and valid
  const cleanPayload = {
    owner_id: String(payload.owner_id || ""),
    pet_id: String(payload.pet_id || ""),
    staff_id: String(payload.staff_id || ""),
    reserve_date_start: String(payload.reserve_date_start || ""),
    reserve_date_end: String(payload.reserve_date_end || ""),
    service_type: String(payload.service_type || ""),
    comment: String(payload.comment || ""),
  };

  console.log("createAdminService - Sending payload:", cleanPayload);

  const response = await fetch(`${ensureApiBase()}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cleanPayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("createAdminService - Error response:", response.status, response.statusText, errorText);
    throw await buildError(response, "ไม่สามารถสร้างบริการใหม่ได้");
  }

  const json = await toJson(response);
  return json?.data ?? json;
}

export async function updateAdminService(
  token: string,
  serviceId: string,
  payload: Record<string, unknown>,
) {
  // Ensure all required fields are present and valid
  // According to Swagger: PATCH /services/{serviceID} expects:
  // comment, owner_id, pet_id, reserve_date_end, reserve_date_start, score, staff_id, status
  // Note: Not including disease and service_type as they may cause backend issues
  const cleanPayload: Record<string, unknown> = {
    owner_id: String(payload.owner_id || ""),
    pet_id: String(payload.pet_id || ""),
    staff_id: String(payload.staff_id || ""),
    reserve_date_start: String(payload.reserve_date_start || ""),
    reserve_date_end: String(payload.reserve_date_end || ""),
    comment: String(payload.comment || ""),
    score: typeof payload.score === "number" ? payload.score : (payload.score ? Number(payload.score) : 0), // score should be number
    status: String(payload.status || "wait"), // status field as per Swagger
  };

  console.log("updateAdminService - Sending payload:", cleanPayload);
  console.log("updateAdminService - Service ID:", serviceId);

  const response = await fetch(`${ensureApiBase()}/services/${encodeURIComponent(serviceId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cleanPayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("updateAdminService - Error response:", response.status, response.statusText, errorText);
    console.error("updateAdminService - Payload that caused error:", cleanPayload);
    
    // Try to parse error message if it's JSON
    let errorMessage = "ไม่สามารถอัปเดตบริการได้";
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // If not JSON, use the error text directly if available
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw await buildError(response, errorMessage);
  }

  const json = await toJson(response);
  return json?.data ?? json;
}

export async function updateServiceStatus(
  token: string,
  serviceId: string,
  status: string,
) {
  const response = await fetch(
    `${ensureApiBase()}/services/${encodeURIComponent(serviceId)}/${status}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw await buildError(response, "ไม่สามารถอัปเดตสถานะบริการได้");
  }

  const json = await toJson(response);
  return json?.data ?? json;
}

export async function deleteAdminService(token: string, serviceId: string) {
  const response = await fetch(`${ensureApiBase()}/services/${encodeURIComponent(serviceId)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw await buildError(response, "ลบบริการไม่สำเร็จ");
  }

  return toJson(response);
}

// Normalize service collection from API response
export function normalizeServiceCollection(data: unknown): AdminService[] {
  if (!data) return [];

  // Handle array directly
  if (Array.isArray(data)) {
    return data.map((item) => normalizeServiceItem(item));
  }

  // Handle paginated response
  if (typeof data === "object" && "items" in data) {
    const items = (data as { items: unknown[] }).items;
    if (Array.isArray(items)) {
      return items.map((item) => normalizeServiceItem(item));
    }
  }

  // Handle root-level services array: { amount, page, services: [...] }
  if (typeof data === "object" && "services" in (data as Record<string, unknown>)) {
    const services = (data as { services?: unknown }).services;
    if (Array.isArray(services)) {
      return services.map((item) => normalizeServiceItem(item));
    }
  }

  // Handle backend shape: { data: { services: [...] } }
  if (typeof data === "object" && "data" in data) {
    const payload = (data as { data: unknown }).data as unknown;
    if (payload && typeof payload === "object") {
      const container = payload as { services?: unknown; items?: unknown; data?: unknown };
      if (Array.isArray(container.services)) {
        return (container.services as unknown[]).map((item) => normalizeServiceItem(item));
      }
      if (Array.isArray(container.items)) {
        return (container.items as unknown[]).map((item) => normalizeServiceItem(item));
      }
      if (Array.isArray(container.data)) {
        return (container.data as unknown[]).map((item) => normalizeServiceItem(item));
      }
    }
  }

  // Handle single item wrapped
  if (typeof data === "object" && "data" in data) {
    const nested = (data as { data: unknown }).data;
    if (Array.isArray(nested)) {
      return nested.map((item) => normalizeServiceItem(item));
    }
  }

  return [];
}

function normalizeServiceItem(item: unknown): AdminService {
  if (!item || typeof item !== "object") {
    return {
      id: "unknown",
      show_id: "",
      owner_id: "",
      pet_id: "",
      staff_id: "",
      reserve_date_start: "",
      reserve_date_end: "",
      service_type: "",
      comment: "",
      score: 0,
      status: "wait",
      created_at: "",
      owner_name: "Unknown",
      pet_name: "Unknown",
      staff_name: "Unknown",
    };
  }

  const service = item as Record<string, unknown>;

  return {
    // support both id and service_id
    id: String(service.id ?? service.service_id ?? "unknown"),
    show_id: String(service.show_id ?? service.showId ?? ""),
    // Support OID (from database) or owner_id (from API)
    owner_id: String(service.OID ?? service.oid ?? service.owner_id ?? ""),
    // From Supabase Service table: PETID (uuid) is the foreign key to Pet table
    pet_id: String(service.PETID ?? service.pet_id ?? service.petId ?? ""),
    staff_id: String(service.staff_id ?? ""),
    reserve_date_start: String(service.reserve_date_start ?? ""),
    reserve_date_end: String(service.reserve_date_end ?? ""),
    service_type: String(service.service_type ?? ""),
    comment: String(service.comment ?? ""),
    score: Number(service.score ?? 0),
    status: (["wait", "ongoing", "finish"].includes(String(service.status)) 
      ? String(service.status) 
      : "wait") as "wait" | "ongoing" | "finish",
    created_at: String(service.created_at ?? ""),
    owner_name: String(service.owner_name ?? "Unknown"),
    pet_name: String(service.pet_name ?? "Unknown"),
    staff_name: String(service.staff_name ?? "Unknown"),
  };
}

export type AdminService = {
  id: string;
  show_id: string;
  owner_id: string;
  pet_id: string;
  staff_id: string;
  reserve_date_start: string;
  reserve_date_end: string;
  service_type: string;
  comment: string;
  score: number;
  status: "wait" | "ongoing" | "finish";
  created_at: string;
  owner_name: string;
  pet_name: string;
  staff_name: string;
};

// Helpers: fetch names for owners and pets
// Helper function similar to admin/users page
function getFirstString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number") return value.toString();
  }
  return undefined;
}

export async function fetchOwnerNamesMap(token: string, targetIds: string[]): Promise<Record<string, string>> {
  const needed = Array.from(new Set(targetIds.filter(Boolean)));
  const result: Record<string, string> = {};
  if (needed.length === 0) return result;

  const limit = 200;
  let page = 1;

  while (true) {
    const url = `${ensureApiBase()}/admin/users?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const json = await toJson(res);
    
    // Response structure: {message: "success", data: {amount: 16, limit: 20, page: 1, users: [...]}}
    let usersArray: unknown[] = [];
    if (json && typeof json === "object") {
      const data = (json as any).data;
      if (data && typeof data === "object") {
        if (Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (Array.isArray(data)) {
          usersArray = data;
        }
      }
      // Fallback: try direct array or other shapes
      if (usersArray.length === 0) {
        if (Array.isArray(json)) usersArray = json;
        else if (Array.isArray((json as any).users)) usersArray = (json as any).users;
      }
    }

    for (const entry of usersArray) {
      const rec = entry as Record<string, unknown>;
      // From response: user_id is the UUID identifier (OID maps to user_id)
      const userId = String(rec.user_id ?? rec.userId ?? rec.id ?? "");
      // From response: name field contains the owner name
      const name = String(rec.name ?? rec.full_name ?? rec.email ?? "");
      // Map by user_id (UUID) which matches OID in Service table
      if (userId && name && needed.includes(userId)) {
        result[userId] = name;
      }
    }

    if (usersArray.length < limit) break;
    page += 1;
  }

  return result;
}

export async function fetchPetNamesMap(
  token: string, 
  petIds: string[], 
  petIdToOwnerIdMap?: Record<string, string>
): Promise<Record<string, string>> {
  const target = new Set(petIds.filter(Boolean));
  const result: Record<string, string> = {};
  if (target.size === 0) return result;

  // If we have petIdToOwnerIdMap, use GET /pets/{ownerID} for each owner
  if (petIdToOwnerIdMap && Object.keys(petIdToOwnerIdMap).length > 0) {
    // Group pets by owner_id
    const ownerToPets: Record<string, string[]> = {};
    for (const petId of petIds) {
      if (petIdToOwnerIdMap[petId]) {
        const ownerId = petIdToOwnerIdMap[petId];
        if (!ownerToPets[ownerId]) {
          ownerToPets[ownerId] = [];
        }
        ownerToPets[ownerId].push(petId);
      }
    }

    // Fetch pets for each owner
    for (const [ownerId, ownerPetIds] of Object.entries(ownerToPets)) {
      try {
        const url = `${ensureApiBase()}/pets/${ownerId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        
        if (!res.ok) {
          console.warn(`Failed to fetch pets for owner ${ownerId}:`, res.status, res.statusText);
          continue;
        }
        
        const json = await toJson(res);
        let petsArray: unknown[] = [];
        
        if (json && typeof json === "object") {
          const data = (json as any).data;
          if (Array.isArray(data)) {
            petsArray = data;
          } else if (typeof data === "string") {
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed)) {
                petsArray = parsed;
              } else if (Array.isArray(parsed.pets)) {
                petsArray = parsed.pets;
              }
            } catch {}
          } else if (data && typeof data === "object") {
            if (Array.isArray(data.pets)) petsArray = data.pets;
            else if (Array.isArray(data.items)) petsArray = data.items;
            else if (Array.isArray(data.data)) petsArray = data.data;
          }
        }
        
        // Find matching pets
        for (const entry of petsArray) {
          const rec = entry as Record<string, unknown>;
          const id = String(rec.PETID ?? rec.pet_id ?? rec.id ?? "");
          if (id && ownerPetIds.includes(id) && target.has(id)) {
            const name = String(rec.name ?? rec.pet_name ?? rec.petName ?? "");
            if (name) result[id] = name;
          }
        }
      } catch (err) {
        console.error(`Error fetching pets for owner ${ownerId}:`, err);
        continue;
      }
    }
    
    return result;
  }

  // Fallback: Try to fetch from all owners (slower but works if no map provided)
  console.warn("fetchPetNamesMap: No petIdToOwnerIdMap provided, using fallback method");
  const owners = await fetchAllOwners(token);
  
  for (const owner of owners) {
    try {
      const url = `${ensureApiBase()}/pets/${owner.id}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      
      if (!res.ok) continue;
      
      const json = await toJson(res);
      let petsArray: unknown[] = [];
      
      if (json && typeof json === "object") {
        const data = (json as any).data;
        if (Array.isArray(data)) {
          petsArray = data;
        } else if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              petsArray = parsed;
            } else if (Array.isArray(parsed.pets)) {
              petsArray = parsed.pets;
            }
          } catch {}
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.pets)) petsArray = data.pets;
          else if (Array.isArray(data.items)) petsArray = data.items;
          else if (Array.isArray(data.data)) petsArray = data.data;
        }
      }
      
      for (const entry of petsArray) {
        const rec = entry as Record<string, unknown>;
        const id = String(rec.PETID ?? rec.pet_id ?? rec.id ?? "");
        if (id && target.has(id)) {
          const name = String(rec.name ?? rec.pet_name ?? rec.petName ?? "");
          if (name) result[id] = name;
        }
        // If we found all pets, break early
        if (Object.keys(result).length === target.size) break;
      }
      
      // If we found all pets, break early
      if (Object.keys(result).length === target.size) break;
    } catch (err) {
      console.error(`Error fetching pets for owner ${owner.id}:`, err);
      continue;
    }
  }

  return result;
}

// Fetch staff names by staff_id (staff can be Caretaker or Doctor role)
export async function fetchStaffNamesMap(token: string, staffIds: string[]): Promise<Record<string, string>> {
  const needed = Array.from(new Set(staffIds.filter(Boolean)));
  const result: Record<string, string> = {};
  if (needed.length === 0) return result;

  const limit = 200;
  let page = 1;

  while (true) {
    const url = `${ensureApiBase()}/admin/users?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const json = await toJson(res);
    const container = (json?.data ?? json) as Record<string, unknown> | unknown[];

    // Accept multiple shapes: array, { users: [...] }, { items: [...] }, { data: [...] }
    let usersArray: unknown[] = [];
    if (Array.isArray(container)) usersArray = container as unknown[];
    else if (Array.isArray((container as any)?.users)) usersArray = (container as any).users as unknown[];
    else if (Array.isArray((container as any)?.items)) usersArray = (container as any).items as unknown[];
    else if (Array.isArray((container as any)?.data)) usersArray = (container as any).data as unknown[];

    for (const entry of usersArray) {
      const rec = entry as Record<string, unknown>;
      // Staff can be identified by user_id, userId, id, or show_id
      const userId = String(rec.user_id ?? rec.userId ?? rec.id ?? rec.show_id ?? "");
      const role = String(rec.role ?? "").toLowerCase();
      // Only include Caretaker or Doctor (staff roles)
      if ((role === "caretaker" || role === "doctor") && userId && needed.includes(userId)) {
        const name = String(rec.name ?? rec.full_name ?? rec.email ?? "");
        if (name) result[userId] = name;
      }
    }

    if (usersArray.length < limit) break;
    page += 1;
  }

  return result;
}

// Types for dropdown options
export type OwnerOption = { id: string; name: string };
export type PetOption = { id: string; name: string; owner_id: string }; // Add owner_id (OID) to filter pets by owner
export type StaffOption = { id: string; name: string; role: string };

// Fetch all owners (users) for dropdown
export async function fetchAllOwners(token: string): Promise<OwnerOption[]> {
  const result: OwnerOption[] = [];
  const limit = 200;
  let page = 1;

  while (true) {
    const url = `${ensureApiBase()}/admin/users?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const json = await toJson(res);
    
    let usersArray: unknown[] = [];
    if (json && typeof json === "object") {
      const data = (json as any).data;
      if (data && typeof data === "object") {
        if (Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (Array.isArray(data)) {
          usersArray = data;
        }
      }
      if (usersArray.length === 0) {
        if (Array.isArray(json)) usersArray = json;
        else if (Array.isArray((json as any).users)) usersArray = (json as any).users;
      }
    }

    for (const entry of usersArray) {
      const rec = entry as Record<string, unknown>;
      const userId = String(rec.user_id ?? rec.userId ?? rec.id ?? "");
      const role = String(rec.role ?? "").toLowerCase();
      // Only include users with role = "owner"
      if (role === "owner" && userId) {
        const name = String(rec.name ?? rec.full_name ?? rec.email ?? "");
        if (name) {
          result.push({ id: userId, name });
        }
      }
    }

    if (usersArray.length < limit) break;
    page += 1;
  }

  return result;
}

// Fetch all pets for dropdown
// According to Swagger: GET /pets/{ownerID} - need to fetch pets for each owner
export async function fetchAllPets(token: string): Promise<PetOption[]> {
  const result: PetOption[] = [];
  
  // First, fetch all owners
  const owners = await fetchAllOwners(token);
  console.log("fetchAllPets - Total owners:", owners.length);
  
  // Then fetch pets for each owner using GET /pets/{ownerID}
  for (const owner of owners) {
    try {
      const url = `${ensureApiBase()}/pets/${owner.id}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      
      if (!res.ok) {
        console.warn(`Failed to fetch pets for owner ${owner.id}:`, res.status, res.statusText);
        continue;
      }
      
      const json = await toJson(res);
      console.log(`fetchAllPets - Response for owner ${owner.id}:`, json);
      
      // Response structure: { data: "string" | array, message: "string", status: number }
      // data might be a string (JSON string) or array directly
      let petsArray: unknown[] = [];
      
      if (json && typeof json === "object") {
        const data = (json as any).data;
        if (Array.isArray(data)) {
          petsArray = data;
        } else if (typeof data === "string") {
          // If data is a JSON string, parse it
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              petsArray = parsed;
            } else if (Array.isArray(parsed.pets)) {
              petsArray = parsed.pets;
            }
          } catch {
            // If parsing fails, try other shapes
          }
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.pets)) petsArray = data.pets;
          else if (Array.isArray(data.items)) petsArray = data.items;
          else if (Array.isArray(data.data)) petsArray = data.data;
        }
      }
      
      console.log(`fetchAllPets - Extracted ${petsArray.length} pets for owner ${owner.id}`);
      
      for (const entry of petsArray) {
        const rec = entry as Record<string, unknown>;
        // From Supabase: PETID (uuid), name (text), OID (uuid)
        const id = String(rec.PETID ?? rec.pet_id ?? rec.id ?? "");
        const name = String(rec.name ?? rec.pet_name ?? rec.petName ?? "");
        // OID is the owner_id (foreign key)
        const owner_id = String(rec.OID ?? rec.oid ?? rec.owner_id ?? owner.id);
        
        if (id && name) {
          result.push({ id, name, owner_id });
        }
      }
    } catch (err) {
      console.error(`Error fetching pets for owner ${owner.id}:`, err);
      continue;
    }
  }
  
  console.log("fetchAllPets - Total pets collected:", result.length);
  return result;
}

// Fetch pet name by PETID - use GET /pets/{ownerID} and find the pet
// Since we need to get pet by PETID, we'll need to fetch from owner's pets
export async function fetchPetNameByPetId(token: string, petId: string, ownerId: string): Promise<string> {
  if (!petId || !ownerId) return "Unknown";
  
  try {
    // Use GET /pets/{ownerID} to get all pets of owner, then find the one with matching PETID
    const url = `${ensureApiBase()}/pets/${ownerId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch pets for owner ${ownerId}:`, res.status, res.statusText);
      return "Unknown";
    }
    
    const json = await toJson(res);
    let petsArray: unknown[] = [];
    
    if (json && typeof json === "object") {
      const data = (json as any).data;
      if (Array.isArray(data)) {
        petsArray = data;
      } else if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            petsArray = parsed;
          } else if (Array.isArray(parsed.pets)) {
            petsArray = parsed.pets;
          }
        } catch {}
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.pets)) petsArray = data.pets;
        else if (Array.isArray(data.items)) petsArray = data.items;
        else if (Array.isArray(data.data)) petsArray = data.data;
      }
    }
    
    // Find pet with matching PETID
    for (const entry of petsArray) {
      const rec = entry as Record<string, unknown>;
      const id = String(rec.PETID ?? rec.pet_id ?? rec.id ?? "");
      if (id === petId) {
        const name = String(rec.name ?? rec.pet_name ?? rec.petName ?? "");
        if (name) return name;
      }
    }
  } catch (err) {
    console.error(`Error fetching pet name for PETID ${petId}:`, err);
  }
  
  return "Unknown";
}

// Fetch pets by owner ID using GET /pets/{ownerID}
export async function fetchPetsByOwnerId(token: string, ownerId: string): Promise<PetOption[]> {
  const result: PetOption[] = [];
  
  try {
    const url = `${ensureApiBase()}/pets/${ownerId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch pets for owner ${ownerId}:`, res.status, res.statusText);
      return [];
    }
    
    const json = await toJson(res);
    console.log(`fetchPetsByOwnerId - Response for owner ${ownerId}:`, json);
    
    // Response structure: { data: "string" | array, message: "string", status: number }
    let petsArray: unknown[] = [];
    
    if (json && typeof json === "object") {
      const data = (json as any).data;
      if (Array.isArray(data)) {
        petsArray = data;
      } else if (typeof data === "string") {
        // If data is a JSON string, parse it
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            petsArray = parsed;
          } else if (Array.isArray(parsed.pets)) {
            petsArray = parsed.pets;
          }
        } catch {
          // If parsing fails, try other shapes
        }
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.pets)) petsArray = data.pets;
        else if (Array.isArray(data.items)) petsArray = data.items;
        else if (Array.isArray(data.data)) petsArray = data.data;
      }
    }
    
    console.log(`fetchPetsByOwnerId - Extracted ${petsArray.length} pets for owner ${ownerId}`);
    
    for (const entry of petsArray) {
      const rec = entry as Record<string, unknown>;
      // From Supabase: PETID (uuid), name (text), OID (uuid)
      const id = String(rec.PETID ?? rec.pet_id ?? rec.id ?? "");
      const name = String(rec.name ?? rec.pet_name ?? rec.petName ?? "");
      // OID is the owner_id (foreign key)
      const owner_id = String(rec.OID ?? rec.oid ?? rec.owner_id ?? ownerId);
      
      if (id && name) {
        result.push({ id, name, owner_id });
      }
    }
  } catch (err) {
    console.error(`Error fetching pets for owner ${ownerId}:`, err);
    return [];
  }
  
  console.log("fetchPetsByOwnerId - Total pets collected:", result.length);
  return result;
}

// Fetch all staff (caretaker or doctor) for dropdown
export async function fetchAllStaff(token: string): Promise<StaffOption[]> {
  const result: StaffOption[] = [];
  const limit = 200;
  let page = 1;

  while (true) {
    const url = `${ensureApiBase()}/admin/users?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) break;
    const json = await toJson(res);
    const container = (json?.data ?? json) as Record<string, unknown> | unknown[];

    let usersArray: unknown[] = [];
    if (Array.isArray(container)) usersArray = container as unknown[];
    else if (Array.isArray((container as any)?.users)) usersArray = (container as any).users as unknown[];
    else if (Array.isArray((container as any)?.items)) usersArray = (container as any).items as unknown[];
    else if (Array.isArray((container as any)?.data)) usersArray = (container as any).data as unknown[];

    for (const entry of usersArray) {
      const rec = entry as Record<string, unknown>;
      const userId = String(rec.user_id ?? rec.userId ?? rec.id ?? rec.show_id ?? "");
      const role = String(rec.role ?? "").toLowerCase();
      if ((role === "caretaker" || role === "doctor") && userId) {
        const name = String(rec.name ?? rec.full_name ?? rec.email ?? "");
        if (name) {
          result.push({ id: userId, name, role });
        }
      }
    }

    if (usersArray.length < limit) break;
    page += 1;
  }

  return result;
}
