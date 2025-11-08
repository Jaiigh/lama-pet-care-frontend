import Image from "next/image";
import emptyPetAvatar from "@/images/empty-pet-avatar.png";

import dayjs from 'dayjs';

import { use, useEffect, useState } from "react";
import { Pet, PetsResponse } from "@/interfaces/profileInterface";
import { getMyPets } from "@/services/profileService";

function Animal() {
  const [pets, setPets] = useState<Pet[] | null>(null);

  useEffect(() => {
        const fetchReservations = async () => {
          try {
            const response : Pet[] = await getMyPets();
            setPets(response);
          } catch (error) {
            console.error("Error fetching pets:", error);
          }
        };
        fetchReservations();
      }, []);

  const current = dayjs()

  return (
    <div>
      <div className="pl-5 text-[#072568]">* สัตว์เลี้ยงของฉัน</div>
      <div className="flex flex-row flex-wrap items-center justify-center w-full h-auto py-[30px] px-0 pb-[50px] gap-[10px] bg-white border border-[#ccc] rounded-[15px]">
        {pets && pets.map((pet) => (
          <div
            key={pet.pet_id}
            className="w-[200px] h-[250px] p-5 text-center bg-[#EAFFF9] text-[#072568] rounded-[20px] border-2 border-[#C6E0DD]"
          >
            <Image
              src={emptyPetAvatar}
              alt="pet-photo"
              width={120}
              height={120}
              className="w-[100px] h-[100px] rounded-full object-cover mx-auto"
            />
            <div className="text-medium font-bold pt-[5px]">{pet.name}</div>
            <div className="text-sm text-left pt-[15px]">
              <div>พันธู์: {pet.kind} - {pet.breed}</div>
              <div>
                อายุ: {current.diff(pet.birth_date, 'year')} ปี {current.diff(pet.birth_date, 'month') % 12} เดือน * {pet.weight} กก.
              </div>
              <div>
                เพศ: {pet.sex}
              </div>
            </div>
          </div>
        ))}
        <div className="w-[200px] h-[250px] pt-20 px-5 pb-5 text-center text-[#072568] rounded-[20px] border-2 border-[#C6E0DD] border-dashed">
          <div>+</div>
          <div>เพิ่มสัตว์เลี้ยงใหม่</div>
          <div>ติดต่อเเอดมินเพื่อเพิ่ม</div>
        </div>
      </div>
    </div>
  );
}

export default Animal;
