import { Profile } from "@/interfaces/profileInterface";
import { Pet } from "@/interfaces/petInterface";
export const getProfileByAdmin = async (userId: string , adminToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch profile by admin");
        }
        const data = await response.json();
        return data;
    }catch (err) {
        console.error("Error fetching profile by admin:", err);
        throw err;
    }
};
export const updateProfileByAdmin = async (userId: string, profileData: Partial<Profile>, adminToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`,
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) {
            throw new Error("Failed to update profile by admin");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error updating profile by admin:", err);
        throw err;
    }
};
export const getPetByAdminUsingOwnerId = async (ownerId: string, adminToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/pets/${ownerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch pets by admin using owner ID");
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error("Error fetching pets by admin using owner ID:", err);
        throw err;
    }
};
export const addPetByAdmin = async (petData: Partial<Pet>, adminToken: string ,userId: string) => {
    try {
        petData.birth_date = petData.birth_date + "T00:00:00Z";
        console.log(`${process.env.NEXT_PUBLIC_API_BASE}/pets/${userId}`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/pets/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`,
            },
            body: JSON.stringify(petData),
        });
        if (!response.ok) {
            throw new Error("Failed to add pet by admin");
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error("Error adding pet by admin:", err);
        throw err;
    }
};
export async function deletePetByAdmin(petId: string, adminToken: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/pets/${petId}`;

    const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to delete pet: ${res.status} ${text}`);
    }
}
export default{
    getProfileByAdmin,
    updateProfileByAdmin,
    getPetByAdminUsingOwnerId,
    addPetByAdmin,
    deletePetByAdmin
}