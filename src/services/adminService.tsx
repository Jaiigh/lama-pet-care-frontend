const getProfileByAdmin = async (userId: string , adminToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/users/?userId=${userId}`, {
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
export default getProfileByAdmin;