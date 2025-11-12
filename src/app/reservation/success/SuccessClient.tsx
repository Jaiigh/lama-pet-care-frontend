"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

const containerClasses =
  "min-h-screen bg-[#EBF8F4] flex items-center justify-center px-4 py-12";
const cardClasses =
  "w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const hasSession = useMemo(() => Boolean(sessionId), [sessionId]);

  if (!hasSession) {
    return (
      <div className={containerClasses}>
        <div className={cardClasses}>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment could not be confirmed
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find your payment session. Please return and try
            again.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-lg bg-[#61C5AA] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4FA889]"
            >
              Go back
            </button>
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Start a new reservation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment successful 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Your reservation is confirmed. You can review the details in your
          bookings dashboard.
        </p>

        <div className="mb-8 rounded-lg bg-[#EBF8F4] p-4 text-left">
          <p className="text-sm font-semibold text-gray-700">
            Payment session ID
          </p>
          <p className="mt-1 break-all text-sm text-gray-600">{sessionId}</p>
        </div>

        <Link
          href="/reservation/my-bookings"
          className="inline-flex items-center justify-center rounded-lg bg-[#61C5AA] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4FA889]"
        >
          View my reservations
        </Link>
      </div>
    </div>
  );
}
