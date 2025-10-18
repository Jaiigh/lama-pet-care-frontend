<<<<<<< HEAD
import { handler } from "next/dist/build/templates/app-page";

=======
>>>>>>> origin/main
const record = [
  {
    id: 1,
    title: "การนัดหมาย",
    pet: "ไอโบ้",
    handler: "หมอสมชาย",
    date: "12 ม.ค. 2024",
    status: "รอดำเนินการ",
  },
  {
    id: 2,
    title: "การนัดหมาย",
    pet: "เหมียว",
    handler: "หมอสมชาย",
    date: "15 ม.ค. 2024",
    status: "ยกเลิก",
  },
  {
    id: 3,
    title: "การนัดหมาย",
    pet: "ไอโบ้",
    handler: "หมอสมชาย",
    date: "20 ม.ค. 2024",
    status: "เสร็จสิ้น",
  },
  {
    id: 4,
    title: "การนัดหมาย",
    pet: "เหมียว",
    handler: "หมอสมชาย",
    date: "25 ม.ค. 2024",
    status: "ยกเลิก",
  },
  {
    id: 5,
    title: "การนัดหมาย",
    pet: "ไอโบ้",
    handler: "หมอสมชาย",
    date: "30 ม.ค. 2024",
    status: "เสร็จสิ้น",
  },
  {
    id: 6,
    title: "การนัดหมาย",
    pet: "เหมียว",
    handler: "หมอสมชาย",
    date: "5 ก.พ. 2024",
    status: "เสร็จสิ้น",
  },
];

const shownRecord = record.slice(0, 3);

function Record() {
  return (
    <div>
      <div className="pl-5 text-[#072568]">* ประวัติการใช้บริการ</div>
      <div className="flex flex-col flex-wrap items-center justify-center w-full h-auto py-[30px] px-0 pb-[50px] gap-[10px] bg-white border border-[#ccc] rounded-[15px]">
        {shownRecord.map((item) => (
          <div
            key={item.id}
            className="flex flex-row p-5 bg-[#EAFFF9] w-[90%] h-[90px] rounded-[20px]"
          >
            <div className="text-[#072568]">
              <div className="text-medium font-bold">
                {item.title} - {item.pet}
              </div>
              <div className="text-sm pt-[5px]">
                {item.handler} | {item.date}
              </div>
            </div>
            <div className="flex flex-col justify-center text-center my-auto ml-auto text-white bg-[#5AD5CC] w-[160px] h-[40px] rounded-[20px]">
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Record;
