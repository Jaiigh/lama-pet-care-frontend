import { environment } from "@/env/environment";
import { Pet } from "@/interfaces/petinterface";
// src/services/petservice.tsx
// adjust environment import path if needed

export const petURL = environment.masterUrl + '/pets';


interface PetsData {
    amount: number;
    pets: Pet[];
}

interface PetsResponse {
    message: string;
    data: PetsData;
    status: number;
}


export async function getPetsByOwner(): Promise<Pet[]> {
    const url = `${petURL}/owner`;

    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch pets: ${res.status} ${text}`);
    }

    const body = (await res.json()) as PetsResponse;
    return body?.data?.pets ?? [];
}