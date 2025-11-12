"use client";

import { use, useEffect, useState } from "react";
import { Reservation, ReservationApiResponse } from "@/interfaces/reservationInterface";
import { Payment, PaymentApiResponse } from "@/interfaces/paymentInterface";
import { getAllReservation } from "@/services/reservationService";
import { getAllPayment } from "@/services/paymentService";

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
    useEffect(() => {
      const fetchReservations = async () => {
        try {
          const response : Reservation[] = await getAllReservation();
          setReservations(response);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };
      fetchReservations();

      const fetchPayments = async () => {
        try {
          const response : Payment[] = await getAllPayment();
          setPayments(response);
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };
      fetchPayments();
    }, []);

  const paymentMap = payments.reduce((map, payment) => {
        map[payment.payment_id] = payment;
        return map;
    }, {} as Record<string, Payment>);

  const shortenID = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-[#FFD978] text-black";
      case "wait":
        return "bg-[#F1EED9] text-black";
      case "finished":
        return "bg-[#61C5AA] text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="reserve-management p-5">
        <div className="header-container w-[1250px] h-[78px] mx-auto bg-[#F7F5E9] flex items-center">
            <h1 className="text-[20px] font-bold text-black pl-7">การจอง</h1>
        </div>
        <div className="type-container w-[1250px] h-[40px] mx-auto bg-[#F3F1E0] border border-[#D8D5BD] flex items-center gap-10 pl-5">
            <div>กำลังดำเนินการ</div>
            <div>ทั้งหมด</div>
            <div>เสร็จสิ้น</div>
        </div>
        <div className="reserve-container w-[1250px] h-[492px] mx-auto pt-7 bg-[#FDFDFA] flex flex-col gap-4 max-h-[500px] overflow-y-auto overflow-x-hidden">
            {reservations && reservations.map((reserve) => (
                <div key={reserve.service_id} className="reserve-item p-5 px-[70px] mx-auto w-[1200px] h-[98px] border border-gray-400 rounded-lg grid grid-cols-[150px_150px_150px_150px_150px] gap-x-20">
                    <div className="detail-group flex flex-col items-start gap-1">
                        <div className="label text-[13px]">หมายเลขการจอง</div>
                        <div className="value text-[22px] font-bold text-[#3AB795]">{shortenID(reserve.service_id)}</div>
                    </div>
                    <div className="detail-group flex flex-col items-start gap-1">
                        <div className="label text-[13px]">วันที่จอง</div>
                        <div className="value text-[22px] font-bold text-[#3AB795]">{reserve.reserve_date_start.split('T')[0]}</div>
                    </div>
                    <div className="detail-group flex flex-col items-start gap-1">
                        <div className="label text-[13px]">เวลา</div>
                        <div className="value text-[22px] font-bold text-[#3AB795]">{reserve.reserve_date_start.split('T')[1].slice(0, -1)}</div>
                    </div>
                    <div className="detail-group flex flex-col items-start gap-1">
                        <div className="label text-[13px]">ราคาค่าบริการ</div>
                        <div className="value text-[22px] font-bold text-[#3AB795]">{paymentMap[reserve.payment_id]?.price ?? 'N/A'}</div>
                    </div>
                    <div className="detail-group flex flex-col items-start gap-1">
                        <div className="label text-[13px]">สถานะ</div>
                        <div className={`text-[16px] font-bold px-10 py-1.5 rounded-[15px] ${getStatusClass(reserve.status)}`}>
                          {reserve.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
