"use client";

import "./page.css";

const reserves = [
  {
    id: 1,
    bookingID: "1234567880",
    date: "22-10-2025",
    time: "11.00AM",
    service: "Doctor",
    status: "Ongoing"
  },
  {
    id: 2,
    bookingID: "1234567880",
    date: "22-10-2025",
    time: "11.00AM",
    service: "Caretaker",
    status: "Wait"
  },
  {
    id: 3,
    bookingID: "1234567880",
    date: "22-10-2025",
    time: "11.00AM",
    service: "Doctor",
    status: "Finished"
  },
]

export default function Home() {
  return (
    <div className="reserve-management">
        <div className="header-container">
            <h1>การจอง</h1>
        </div>
        <div className="type-container">
            <div>กำลังดำเนินการ</div>
            <div>ทั้งหมด</div>
            <div>เสร็จสิ้น</div>
        </div>
        <div className="reserve-container">
            {reserves.map((reserve) => (
                <div key={reserve.id} className="reserve-item">
                    <div className="detail-group">
                        <div className="label">หมายเลขการจอง</div>
                        <div className="value">{reserve.bookingID}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">วันที่จอง</div>
                        <div className="value">{reserve.date}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">เวลา</div>
                        <div className="value">{reserve.time}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">ประเภทบริการ</div>
                        <div className={`service-${reserve.service}`}>{reserve.service}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">สถานะ</div>
                        <div className={`status-${reserve.status}`}>{reserve.status}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
