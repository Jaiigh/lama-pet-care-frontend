import { environment } from "@/env/environment";
import { env } from "process";

// src/services/serviceService.tsx
type ServiceType = 'cservice' | 'mservice';
type ServiceMode = 'full-day' | 'partial';

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
    serviceType: ServiceType;
    serviceMode: ServiceMode;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    signal?: AbortSignal;
}

const API_BASE = environment.masterUrl+"/services/"; 

export async function getAvailableStaff(params: GetAvailableStaffParams): Promise<Staff[]> {
    const { serviceType, serviceMode, startDate, endDate, signal } = params;

    const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const url = new URL('staff', API_BASE);
    url.search = new URLSearchParams({
        serviceType,
        serviceMode,
        startDate,
        endDate,
    }).toString();

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            authorization: `Bearer ${storedToken}`,
        },
        signal,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch available staff: ${res.status} ${errText}`);
    }
    const data = await res.json();
    console.log('API Response:', data);
    console.log('Is data an array?', Array.isArray(data));
    console.log('Does data have staff property?', data && typeof data === 'object' && 'staff' in data);
    console.log('Does data.data exist?', data && typeof data === 'object' && 'data' in data);
    console.log('Does data.data have staff?', data && data.data && typeof data.data === 'object' && 'staff' in data.data);
    
    // Handle different response formats
    let staffArray: Staff[] = [];
    if (Array.isArray(data)) {
        staffArray = data;
    } else if (data && typeof data === 'object') {
        // Check if staff is directly in data
        if ('staff' in data) {
            staffArray = data.staff;
        } 
        // Check if staff is in data.data
        else if ('data' in data && data.data && typeof data.data === 'object' && 'staff' in data.data) {
            staffArray = data.data.staff;
        }
    }
    
    console.log('Final staff array:', staffArray);
    return staffArray;
}

export default { getAvailableStaff };