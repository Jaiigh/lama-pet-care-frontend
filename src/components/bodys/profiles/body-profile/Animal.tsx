import "./Animal.css"
import Image from 'next/image';
import emptyPetAvatar from "@/assets/empty-pet-avatar.png";

const my_pets = [
    {id:1, name:"ไอโบ้", breed:"Golden Retriever", age:"3", weight:"25", gender:"เมีย", color:"ทอง"},
    {id:2, name:"เหมียว", breed:"เปอร์เซีย", age:"2", weight:"4", gender:"ผู้", color:"ขาวครีม"},
    {id:3, name:"เหมียว", breed:"เปอร์เซีย", age:"2", weight:"4", gender:"ผู้", color:"ขาวครีม"},
    {id:4, name:"เหมียว", breed:"เปอร์เซีย", age:"2", weight:"4", gender:"ผู้", color:"ขาวครีม"},
    {id:5, name:"เหมียว", breed:"เปอร์เซีย", age:"2", weight:"4", gender:"ผู้", color:"ขาวครีม"},
]

function Animal() {
    return (
        <div className="animal-profile">
            <div className="header">* สัตว์เลี้ยงของฉัน</div>
            <div className="animal-container">
                {my_pets.map((pet) => (
                    <div key={pet.id} className="pet-display">
                        <Image src={emptyPetAvatar} alt="pet-photo" width={120} height={120}/>
                        <div className="pet-name">{pet.name}</div>
                        <div className="pet-info">
                            <div className="pet-breed">พันธู์: {pet.breed}</div>
                            <div className="pet-age-weight">อายุ: {pet.age} ปี * {pet.weight} กก.</div>
                            <div className="pet-gender-color">เพศ: {pet.gender} * {pet.color}</div>
                        </div>
                    </div>
                ))}
                <div className="add-pet-info">
                    <div>+</div>
                    <div>เพิ่มสัตว์เลี้ยงใหม่</div>
                    <div>ติดต่อเเอดมินเพื่มเพิ่ม</div>
                </div>
            </div>
        </div>
    )
}

export default Animal;