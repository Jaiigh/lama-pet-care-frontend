import { handler } from "next/dist/build/templates/app-page";
import "./Record.css"

const record = [
    { id: 1, title: "การนัดหมาย", pet: "ไอโบ้", handler: "หมอสมชาย", date: "12 ม.ค. 2024", status: "รอดำเนินการ"},
    { id: 2, title: "การนัดหมาย", pet: "เหมียว", handler: "หมอสมชาย", date: "15 ม.ค. 2024", status: "ยกเลิก"},
    { id: 3, title: "การนัดหมาย", pet: "ไอโบ้", handler: "หมอสมชาย", date: "20 ม.ค. 2024", status: "เสร็จสิ้น"},
    { id: 4, title: "การนัดหมาย", pet: "เหมียว", handler: "หมอสมชาย", date: "25 ม.ค. 2024", status: "ยกเลิก"},
    { id: 5, title: "การนัดหมาย", pet: "ไอโบ้", handler: "หมอสมชาย", date: "30 ม.ค. 2024", status: "เสร็จสิ้น"},
    { id: 6, title: "การนัดหมาย", pet: "เหมียว", handler: "หมอสมชาย", date: "5 ก.พ. 2024", status: "เสร็จสิ้น"},
];

const shownRecord = record.slice(0, 3);

function Record() {
    return (
        <div className="activity-log">
            <div className="header">* ประวัติการใช้บริการ</div>
            <div className="record-container">
                {shownRecord.map((item) => (
                    <div key={item.id} className="record-display">
                        <div className="record-text">
                            <div className="record-title">{item.title} - {item.pet}</div>
                            <div className="record-description">{item.handler} | {item.date}</div>
                        </div>
                        <div className="record-status">{item.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Record;