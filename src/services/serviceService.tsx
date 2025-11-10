import { environment } from "@/env/environment";

// src/services/serviceService.tsx
type ServiceType = 'cservice' | 'mservice';
type ServiceMode = 'full-day' | 'partial';

export interface Staff {
    id: string;
    name: string;
    rating: string; // Note: rating is a string in the response
    // add other fields your backend returns
}

export interface StaffResponse {
    amount: number;
    staff: Staff[];
}

export interface GetAvailableStaffParams {
    serviceType: ServiceType;
    serviceMode: ServiceMode;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    signal?: AbortSignal;
}

const serviceURL = environment.masterUrl+"/services/"; 

export async function getAvailableStaff(params: GetAvailableStaffParams): Promise<StaffResponse> {
    const { serviceType, serviceMode, startDate, endDate, signal } = params;

    const url = new URL('/services/staff', serviceURL);
    url.search = new URLSearchParams({
        serviceType,
        serviceMode,
        startDate,
        endDate,
    }).toString();

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch available staff: ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data as StaffResponse;
}

export default { getAvailableStaff };

// Helper function to get just the staff array
export function getStaffArray(response: StaffResponse): Staff[] {
    return response.staff;
}