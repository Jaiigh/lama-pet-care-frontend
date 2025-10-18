import Image from "next/image";
import Logo from "@/images/empty-avatar.png";
import { use, useEffect, useState } from "react";
import { Profile } from "@/interfaces/profileInterface";
import { getProfile } from "@/services/profileService";
function PetOwnerCard() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "0917f704-f9e1-4d21-a940-8eb609242313"; // test user_id -> fix when auth is ready
        const data = await getProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <div className="flex flex-col gap-[10px] pt-[29.5px] px-[90px]">
        <Image src={Logo} alt="avatar" width={64} height={64} /> 
        <div className="text-gray-500 font-bold pt-[10px]" >Pet Owner</div>
        <div className="text-2xl font-bold">{profile ? `${profile.name}` : "Loading..."}</div>
        <p className="text-sm mt-2">📇 {profile?`${profile.name}`:"Loading..." }</p>
        <p className="text-sm">📞 {profile?`${profile.telephone_number}`:"Loading..."}</p>
    </div>
  );
}
export default PetOwnerCard;