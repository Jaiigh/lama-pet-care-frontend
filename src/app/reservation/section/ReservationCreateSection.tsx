"use client";
import ConfirmButton from "../components/ConfirmButton";
import TimeSlotPicker from "../components/TimeSlotPicker";
import PetSelector from "../components/PetSelector";
import ServiceSelector from "../components/ServiceSelector";
function ReservationCreateSection() {
return (
    <div>
    <h2 className="text-xl font-bold">เลือกเวลาและบริการ</h2>
    <p className="text-gray-500">สำหรับวันพฤหัสบดีที่ 25 กันยายน 2568</p>
    
    <div className="mt-6 space-y-[24px]">
        <PetSelector />
        <ServiceSelector />
        <TimeSlotPicker />
        <ConfirmButton />
    </div>
</div>
    );
}
export default ReservationCreateSection;