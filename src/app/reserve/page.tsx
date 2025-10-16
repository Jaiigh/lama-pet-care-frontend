"use client";

import "./page.css";

import { use, useEffect, useState } from "react";
import { Reservation } from "@/interfaces/reservationInterface";
import { getReservation } from "@/services/reservationService";
import test from "node:test";


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
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  
    useEffect(() => {
      const fetchReservations = async () => {
        try {
          const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjA2NDM4MzAsImlhdCI6MTc2MDYyMjIzMCwibmJmIjoxNzYwNjIyMjMwLCJyb2xlIjoib3duZXIiLCJ1c2VyX2lkIjoiNjU4Yjg3YzItOWJmYS00M2ViLWI1YTAtMThiMDk0Y2I5OTZjIn0.lduCXp-0cZzOsLKPW7531t-cSvAmGExZiTu2pikTAu4"; // test token -> fix when auth is ready
          const data = await getReservation(testToken);
          setReservations(data);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };
      fetchReservations();
    }, []);

  const shortenID = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };
  

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
            {reservations.map((reserve) => (
                <div key={reserve.service_id} className="reserve-item">
                    <div className="detail-group">
                        <div className="label">หมายเลขการจอง</div>
                        <div className="value">{shortenID(reserve.service_id)}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">วันที่จอง</div>
                        <div className="value">{reserve.reserve_date.split("T")[0]}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">เวลา</div>
                        <div className="value">{reserve.reserve_date.split("T")[1]}</div>
                    </div>
                    <div className="detail-group">
                        <div className="label">ราคาค่าบริการ</div>
                        <div className="value">{reserve.price}</div>
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
