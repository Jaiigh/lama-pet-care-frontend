import { environment } from "@/env/environment";
import { Pet } from "@/interfaces/petInterface";
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
const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(url, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            authorization: `Bearer ${storedToken}`
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch pets: ${res.status} ${text}`);
    }

    const body = (await res.json()) as PetsResponse;
    return body?.data?.pets ?? [];
}

interface UpdatePetResponse {
    message: string;
    data: { pet: Pet } | null;
    status: number;
}

export async function updatePet(petId: string, payload: Partial<Pet>, token?: string): Promise<Pet> {
    const url = `${petURL}/${petId}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to update pet: ${res.status} ${text}`);
    }

    const body = (await res.json()) as UpdatePetResponse;
    return body?.data?.pet as Pet;
}

export async function deletePetByAdmin(petId: string): Promise<void> {
    const url = `${petURL}/${encodeURIComponent(petId)}`;

    const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to delete pet: ${res.status} ${text}`);
    }
}

