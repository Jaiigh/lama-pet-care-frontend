import { environment } from "@/env/environment";

// src/services/serviceService.tsx
type serviceType = "cservice" | "mservice";
type ServiceMode = "full-day" | "partial";

export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roles?: string[];
  avatarUrl?: string;
  // add other fields your backend returns
}

export interface GetAvailableStaffParams {
  serviceType: serviceType;
  serviceMode: ServiceMode;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  signal?: AbortSignal;
}
export interface GetAvailableTimeSlotsParams {
  serviceType: serviceType;
  staffID: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  signal?: AbortSignal;
}

const API_BASE = environment.masterUrl + "/services/";

export async function getAvailableStaff(
  params: GetAvailableStaffParams
): Promise<Staff[]> {
  const { serviceType, serviceMode, startDate, endDate, signal } = params;

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const url = new URL("staff", API_BASE);
  url.search = new URLSearchParams({
    serviceType,
    serviceMode,
    startDate,
    endDate,
  }).toString();

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: `Bearer ${storedToken}`,
    },
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to fetch available staff: ${res.status} ${errText}`
    );
  }
  const data = await res.json();

  // Handle different response formats
  let staffArray: Staff[] = [];
  if (Array.isArray(data)) {
    staffArray = data;
  } else if (data && typeof data === "object") {
    // Check if staff is directly in data
    if ("staff" in data) {
      staffArray = data.staff;
    }
    // Check if staff is in data.data
    else if (
      "data" in data &&
      data.data &&
      typeof data.data === "object" &&
      "staff" in data.data
    ) {
      staffArray = data.data.staff;
    }
  }

  console.log("Final staff array:", staffArray);
  return staffArray;
}

export async function getAvailableTimeSlots(
  params: GetAvailableTimeSlotsParams
): Promise<{start: string[], stop: string[]}> {
  const { serviceType, staffID, startDate, endDate } = params;

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const url = new URL(`staff/${staffID}/time`, API_BASE);
  url.search = new URLSearchParams({
    serviceType,
    startDate,
    endDate,
  }).toString();

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: `Bearer ${storedToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to fetch busy time slots: ${res.status} ${errText}`
    );
  }
  
  const data = await res.json();
  
  // Define all possible time slots in the domain (8:00 - 16:00)
  const allTimeSlots = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00"
  ];

  // Initialize result with start and stop dates
  const result = {
    start: [...allTimeSlots],
    stop: [...allTimeSlots]
  };

  // Extract busy time slots from response and organize by date
  let busySlotsByDate: Record<string, string[]> = {};
  
  if (Array.isArray(data)) {
    // If response is array of objects with date and slots
    data.forEach((item: any) => {
      if (item.date && Array.isArray(item.slots)) {
        busySlotsByDate[item.date] = item.slots;
      } else if (item.date && item.timeSlots) {
        busySlotsByDate[item.date] = Array.isArray(item.timeSlots) ? item.timeSlots : [item.timeSlots];
      }
    });
  } else if (data && typeof data === "object") {
    // Handle different response formats
    if (data.dates && typeof data.dates === "object") {
      busySlotsByDate = data.dates;
    } else if (data.data && typeof data.data === "object") {
      busySlotsByDate = data.data;
    } else if (data.busySlots && typeof data.busySlots === "object") {
      busySlotsByDate = data.busySlots;
    }
  }

  // Filter out busy slots for start and stop dates
  const startBusySlots = busySlotsByDate[startDate] || [];
  const stopBusySlots = busySlotsByDate[endDate] || [];
  
  result.start = allTimeSlots.filter(slot => !startBusySlots.includes(slot));
  result.stop = allTimeSlots.filter(slot => !stopBusySlots.includes(slot));
  
  console.log("Busy slots - start:", startBusySlots, "stop:", stopBusySlots);
  console.log("Available slots - start:", result.start, "stop:", result.stop);
  
  return result as {start: string[], stop: string[]};
}
export default { getAvailableStaff, getAvailableTimeSlots };
