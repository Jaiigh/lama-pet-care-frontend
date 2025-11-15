import { Profile, Pet, PetsApiResponse } from "@/interfaces/profileInterface";
import { environment } from "@/env/environment";

const ownerURL = environment.masterUrl + "/user/";

export const getProfile = async (): Promise<Profile> => {
  try {
    const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(ownerURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch profile:", response.statusText);
      throw new Error("Failed to fetch profile");
    }
    const json = await response.json();
    console.log(json);
    const data = json.data;
    const profile: Profile = {
      name: data.name,
      user_id: data.show_id,
      telephone_number: data.telephone_number,
      email: data.email,
      created_at: data.created_at,
      birth_date: data.birth_date,
      address: data.address,
    };
    return profile;
  } catch (err) {
    console.error("Error fetching profile:", err);
    throw err;
  }
};

export const updateProfile = async (
  profileData: Partial<Profile>
): Promise<Profile> => {
  console.log("updating...");
  try {
    const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(ownerURL , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      console.error("Failed to update profile:", response.statusText);
      throw new Error("Failed to update profile");
    }
    const data = await response.json();
    console.log(data);
    const updatedProfile: Profile = {
      name: data.name,
      user_id: data.show_id,
      telephone_number: data.telephone_number,
      email: data.email,
      created_at: data.created_at,
      birth_date: data.birth_date,
      address: data.address,
    };
    return updatedProfile;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

const petURL = environment.masterUrl + "/pets/owner/";

export const getMyPets = async (): Promise<Pet[]> => {
  try {
    const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(petURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch pet:", response.statusText);
      throw new Error("Failed to fetch pet");
    }
    const json = await response.json();
    console.log(json);
    return json.data.pets;
  } catch (err) {
    console.error("Error fetching pet:", err);
    throw err;
  }
}
