import { Profile } from "@/interfaces/profileInterface";
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
export default{
    getProfileByAdmin,
    updateProfileByAdmin
}