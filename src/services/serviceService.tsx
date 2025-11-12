import { environment } from "@/env/environment";

// src/services/serviceService.tsx
type ServiceType = 'cservice' | 'mservice';
type ServiceMode = 'full-day' | 'partial';

export interface Staff {
    id: string;
    name: string;
    rating: string; 
}

export interface StaffResponse {
    amount: number;
    staff: Staff[];
}
export interface StaffArrayResponse {
    staff: Staff[];
}
export interface GetAvailableStaffParams {
    serviceType: ServiceType;
    serviceMode: ServiceMode;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
}

const serviceURL = environment.masterUrl+"/services"; 

export async function getAvailableStaff(params: GetAvailableStaffParams): Promise<StaffArrayResponse> {
    const { serviceType, serviceMode, startDate, endDate} = params;

    const url = serviceURL+"/staff";
    const url2= new URL(url);
    url2.search = new URLSearchParams({
        serviceType,
        serviceMode,
        startDate,
        endDate,
    }).toString();

    const res = await fetch(url2.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch available staff: ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data.staff as StaffArrayResponse;
}

export default { getAvailableStaff };

// Helper function to get just the staff array
export function getStaffArray(response: StaffArrayResponse): Staff[] {
    return response.staff;
}