"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/StarRating";
import { ServiceReview, ReviewSubmission } from "@/interfaces/reviewInterface";
import {
  getUnreviewedServices,
  submitRating,
  getCaretakersForOwner,
  CaretakerInfo,
} from "@/services/reviewService";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewsPage() {
  const { isAuthed } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user role on mount
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const role = globalThis.window.localStorage.getItem("role");
      setUserRole(role);
    }
  }, [isAuthed]);
  const [unreviewedServices, setUnreviewedServices] = useState<ServiceReview[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [caretakers, setCaretakers] = useState<CaretakerInfo[]>([]);
  const [showCaretakers, setShowCaretakers] = useState(false);

  useEffect(() => {
    if (isAuthed) {
      fetchServices();
      fetchCaretakers();
    }
  }, [isAuthed]);

  const fetchCaretakers = async () => {
    try {
      const caretakersList = await getCaretakersForOwner();
      setCaretakers(caretakersList);
    } catch (err) {
      console.error("Error fetching caretakers:", err);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const services = await getUnreviewedServices();
      setUnreviewedServices(services);
      // Initialize ratings and comments for each service
      const initialRatings: Record<string, number> = {};
      const initialComments: Record<string, string> = {};
      for (const service of services) {
        initialRatings[service.service_id] = 0;
        initialComments[service.service_id] = "";
      }
      setRatings(initialRatings);
      setComments(initialComments);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (serviceId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [serviceId]: rating,
    }));
  };

  const handleCommentChange = (serviceId: string, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [serviceId]: comment,
    }));
  };

  const handleSubmitRating = async (service: ServiceReview) => {
    const rating = ratings[service.service_id];
    if (!rating || rating === 0) {
      setError("กรุณาให้คะแนนก่อนส่ง");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [service.service_id]: true }));
    setError(null);

    try {
      const review: ReviewSubmission = {
        SID: service.service_id,
        CID: service.staff_id,
        score: rating,
        comment: comments[service.service_id] || undefined,
      };

      await submitRating(review);

      // Remove from unreviewed and refresh
      setUnreviewedServices((prev) =>
        prev.filter((s) => s.service_id !== service.service_id)
      );
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[service.service_id];
        return newRatings;
      });
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[service.service_id];
        return newComments;
      });
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting((prev) => ({ ...prev, [service.service_id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#EBF8F4]">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            กรุณาเข้าสู่ระบบเพื่อดูรีวิว
          </p>
        </div>
      </div>
    );
  }

  // Check if user is an owner (required for reviews)
  if (
    userRole &&
    userRole.toLowerCase() !== "owner" &&
    userRole.toLowerCase() !== "pet owner"
  ) {
    return (
      <div className="min-h-screen bg-[#EBF8F4]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Role Required
            </h2>
            <p className="text-yellow-700">
              You need to be logged in as an <strong>owner</strong> to submit
              reviews. You are currently logged in as:{" "}
              <strong>{userRole}</strong>
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Please log out and log in with an owner account to access the
              review page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF8F4]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">การรีวิว</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#76D8B1]"></div>
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unreviewedServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">ไม่มีบริการที่ต้องรีวิว</p>
              </div>
            ) : (
              unreviewedServices.map((service) => (
                <div
                  key={service.service_id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Service Provider Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {service.staff_avatar ? (
                          <Image
                            src={service.staff_avatar}
                            alt={service.staff_name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#76D8B1] flex items-center justify-center text-white font-semibold text-lg">
                            {service.staff_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          ผู้ให้บริการ
                        </p>
                        <p className="font-medium text-gray-800">
                          {service.staff_name}
                        </p>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            วันที่ให้บริการ
                          </p>
                          <p className="text-gray-800">
                            {formatDate(service.reserve_date_start)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            สัตว์เลี้ยง
                          </p>
                          <p className="text-gray-800">{service.pet_name}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">คะแนน</p>
                        <StarRating
                          rating={ratings[service.service_id] || 0}
                          onRatingChange={(rating) =>
                            handleRatingChange(service.service_id, rating)
                          }
                          size="md"
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          ความคิดเห็น (ไม่บังคับ)
                        </p>
                        <textarea
                          value={comments[service.service_id] || ""}
                          onChange={(e) =>
                            handleCommentChange(
                              service.service_id,
                              e.target.value
                            )
                          }
                          placeholder="เขียนความคิดเห็นเกี่ยวกับการให้บริการ..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76D8B1] resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSubmitRating(service)}
                          disabled={
                            submitting[service.service_id] ||
                            !ratings[service.service_id] ||
                            ratings[service.service_id] === 0
                          }
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            submitting[service.service_id] ||
                            !ratings[service.service_id] ||
                            ratings[service.service_id] === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-[#76D8B1] text-white hover:bg-[#5fc49f]"
                          }`}
                        >
                          {submitting[service.service_id]
                            ? "กำลังส่ง..."
                            : "ส่ง"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="mt-8 flex flex-col gap-4 items-center">
          <button
            onClick={() => setShowCaretakers(!showCaretakers)}
            className="bg-[#76D8B1] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#5fc49f] transition-colors"
          >
            {showCaretakers ? "ซ่อน" : "แสดง"} ผู้ให้บริการทั้งหมด
          </button>

          {showCaretakers && (
            <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ผู้ให้บริการทั้งหมด ({caretakers.length} คน)
              </h2>
              {caretakers.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  ไม่มีผู้ให้บริการ
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caretakers.map((caretaker) => (
                    <div
                      key={caretaker.user_id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#76D8B1] flex items-center justify-center overflow-hidden">
                          {caretaker.profile_image ? (
                            <Image
                              src={caretaker.profile_image}
                              alt={caretaker.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-lg">
                              {caretaker.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {caretaker.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {caretaker.service_count} บริการ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
