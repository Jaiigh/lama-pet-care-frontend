"use client";

import "./page.css";

import { use, useEffect, useState } from "react";
import { Reservation, ReservationApiResponse } from "@/interfaces/reservationInterface";
import { getReservation } from "@/services/reservationService";

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  
    useEffect(() => {
      const fetchReservations = async () => {
        try {
          const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjA4MTgxMTcsImlhdCI6MTc2MDc5NjUxNywibmJmIjoxNzYwNzk2NTE3LCJwdXJwb3NlIjoiYWNjZXNzIiwicm9sZSI6Im93bmVyIiwidXNlcl9pZCI6IjY1OGI4N2MyLTliZmEtNDNlYi1iNWEwLTE4YjA5NGNiOTk2YyJ9.dJ6tHd8fPwEDdhYAS6_8QFq6KT6uvWzURLfNWyRr2LI"; // test token -> fix when auth is ready
          const response : ReservationApiResponse = await getReservation(testToken);
          const services = response.data.services;
          setReservations(services);
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
