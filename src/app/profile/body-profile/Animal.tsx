import Image from "next/image";
import emptyPetAvatar from "@/images/empty-pet-avatar.png";

const my_pets = [
  {
    id: 1,
    name: "ไอโบ้",
    breed: "Golden Retriever",
    age: "3",
    weight: "25",
    gender: "เมีย",
    color: "ทอง",
  },
  {
    id: 2,
    name: "เหมียว",
    breed: "เปอร์เซีย",
    age: "2",
    weight: "4",
    gender: "ผู้",
    color: "ขาวครีม",
  },
  {
    id: 3,
    name: "เหมียว",
    breed: "เปอร์เซีย",
    age: "2",
    weight: "4",
    gender: "ผู้",
    color: "ขาวครีม",
  },
  {
    id: 4,
    name: "เหมียว",
    breed: "เปอร์เซีย",
    age: "2",
    weight: "4",
    gender: "ผู้",
    color: "ขาวครีม",
  },
  {
    id: 5,
    name: "เหมียว",
    breed: "เปอร์เซีย",
    age: "2",
    weight: "4",
    gender: "ผู้",
    color: "ขาวครีม",
  },
];

function Animal() {
  return (
    <div>
      <div className="pl-5 text-[#072568]">* สัตว์เลี้ยงของฉัน</div>
      <div className="flex flex-row flex-wrap items-center justify-center w-full h-auto py-[30px] px-0 pb-[50px] gap-[10px] bg-white border border-[#ccc] rounded-[15px]">
        {my_pets.map((pet) => (
          <div
            key={pet.id}
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
              <div>พันธู์: {pet.breed}</div>
              <div>
                อายุ: {pet.age} ปี * {pet.weight} กก.
              </div>
              <div>
                เพศ: {pet.gender} * {pet.color}
              </div>
            </div>
          </div>
        ))}
        <div className="w-[200px] h-[250px] pt-20 px-5 pb-5 text-center text-[#072568] rounded-[20px] border-2 border-[#C6E0DD] border-dashed">
          <div>+</div>
          <div>เพิ่มสัตว์เลี้ยงใหม่</div>
          <div>ติดต่อเเอดมินเพื่มเพิ่ม</div>
        </div>
      </div>
    </div>
  );
}

export default Animal;
