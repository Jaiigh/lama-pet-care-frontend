import { Profile } from "@/interfaces/profileInterface";
import { environment } from "@/env/environment";

const ownerURL = environment.masterUrl + "owner/";

export const getProfile = async (user_id: string): Promise<Profile> => {
  try {
    const response = await fetch(ownerURL + user_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch profile:", response.statusText);
      throw new Error("Failed to fetch profile");
    }
    const json = await response.json();
    const data = json.data;
    console.log(data);
    const profile: Profile = {
      name: data.name,
      user_id: data.user_id, //this is bullshit -> fix later
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
  user_id: string,
  profileData: Partial<Profile>
): Promise<Profile> => {
  console.log("updating...");
  try {
    const response = await fetch(ownerURL + user_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
      user_id: data.user_id, //this is bullshit -> fix later
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
