"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment } from "@/services/reservationFlowService";
import { PaymentVerificationResponse } from "@/interfaces/reservationFlowInterface";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifying, setVerifying] = useState(true);
  const [verification, setVerification] =
    useState<PaymentVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setVerifying(false);
        return;
      }

      try {
        setVerifying(true);
        const result = await verifyPayment(sessionId);
        setVerification(result);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("Failed to verify payment");
        setVerification({
          success: false,
          message: "Failed to verify payment",
        });
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#EBF8F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#61C5AA] mx-auto mb-4" />
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error || !verification || !verification.success) {
    return (
      <div className="min-h-screen bg-[#EBF8F4] p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment not completed
          </h1>
          <p className="text-gray-600 mb-8">
            {verification?.message ||
              error ||
              "Your payment could not be processed."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-[#61C5AA] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#4FA889] transition-colors"
            >
              Try again
            </button>
            <Link
              href="/reservation"
              className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Edit reservation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF8F4] p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment successful 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Your reservation has been confirmed!
        </p>

        {verification.reservationCode && (
          <div className="mb-6 p-4 bg-[#EBF8F4] rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Reservation Code</p>
            <p className="text-2xl font-bold text-[#61C5AA]">
              {verification.reservationCode}
            </p>
          </div>
        )}

        <div className="text-left mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Reservation Details</h3>
          {verification.reservationId && (
            <p className="text-sm text-gray-600">
              Reservation ID: {verification.reservationId}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {verification.message || "Your reservation is confirmed and ready."}
          </p>
        </div>

        <Link
          href="/reservation/my-bookings"
          className="inline-block bg-[#61C5AA] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#4FA889] transition-colors"
        >
          View My Reservations
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
