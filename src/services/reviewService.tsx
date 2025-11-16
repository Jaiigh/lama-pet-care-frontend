import { environment } from "@/env/environment";
import { API_BASE } from "@/config/api";
import {
  ServiceReview,
  ReviewSubmission,
  ReviewResponse,
  StaffReviewSummary,
  StaffReviewItem,
} from "@/interfaces/reviewInterface";

// Type definitions for API responses
interface ApiService {
  service_id?: string;
  SID?: string;
  staff_id?: string;
  CID?: string;
  caretaker_id?: string;
  pet_id?: string;
  PETID?: string;
  status?: string;
  reserve_date_start?: string;
  rdate_start?: string;
  reserve_date_end?: string;
  rdate_end?: string;
  staff?: {
    name?: string;
    profile_image?: string;
  };
  caretaker?: {
    name?: string;
    profile_image?: string;
  };
  staff_name?: string;
  caretaker_name?: string;
  staff_avatar?: string;
  caretaker_avatar?: string;
  review_score?: number;
  rating?: number;
  review_comment?: string;
  comment?: string;
  review?: {
    score?: number;
    comment?: string;
  };
}

interface ApiReview {
  SID?: string;
  service_id?: string;
  CID?: string;
  caretaker_id?: string;
  staff_id?: string;
  score?: number;
  rating?: number;
  comment?: string;
  review_comment?: string;
  service?: ApiService;
}

// Use API_BASE which includes /api/v1, or fallback to environment.masterUrl
const baseURL =
  API_BASE || environment.masterUrl.replace(/\/api\/?v?\d*$/, "") + "/api/v1";
const reviewURL = baseURL + "/cservice/";
const serviceURL = baseURL + "/services/";
const userURL = baseURL + "/user/";

/**
 * Fetch pet details by pet_id
 */
const fetchPetDetails = async (
  petId: string,
  token: string
): Promise<{ name: string } | null> => {
  try {
    const response = await fetch(`${baseURL}/pets/${petId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const pet = json.data || json;
      return {
        name: pet.name || "Pet",
      };
    }
  } catch {
    // Silently fail - pet name will default to "Pet"
  }
  return null;
};

/**
 * Fetch services that need to be reviewed (not yet reviewed)
 */
export const getUnreviewedServices = async (): Promise<ServiceReview[]> => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!storedToken) {
    console.error("No authentication token found");
    throw new Error("Authentication required");
  }

  try {
    // Fetch only services with status "finish" using the API filter
    const response = await fetch(
      `${serviceURL}?status=finish&page=1&limit=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch services:", response.status, errorText);
      throw new Error(
        `Failed to fetch services: ${response.status} - ${errorText}`
      );
    }

    const json = await response.json();
    const services = json.data?.services || json.services || [];

    if (services.length === 0) {
      return [];
    }

    // All services returned should already be "finish" status from the API filter
    // But double-check to ensure only "finish" status services are shown
    const finishedServices = (services as ApiService[]).filter((service) => {
      const status = (service.status || "").toLowerCase().trim();
      return status === "finish" || status === "finished";
    });

    // Fetch existing reviews to check which services have been reviewed
    let reviewedServiceIds: string[] = [];

    try {
      const reviewsResponse = await fetch(`${reviewURL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        const reviewsArray = (reviewsData.data || reviewsData) as ApiReview[];
        reviewedServiceIds = reviewsArray.map(
          (review) => review.SID || review.service_id || ""
        );
      }
    } catch {
      // Reviews endpoint not available, will check services individually
    }

    // Filter out services that already have reviews
    const unreviewedServices = finishedServices.filter((service) => {
      const serviceId = service.service_id || service.SID;
      return serviceId && !reviewedServiceIds.includes(serviceId);
    });

    // Transform to ServiceReview format and fetch caretaker/pet details
    // Use the service data directly without fetching individual service details to avoid duplicates
    return await Promise.all(
      unreviewedServices
        .filter((service) => {
          // Only process services with valid IDs
          return !!(service.service_id || service.SID);
        })
        .map(async (service) => {
          const serviceId = service.service_id || service.SID || "";
          const staffId =
            service.staff_id || service.CID || service.caretaker_id || "";
          const petId = service.pet_id || service.PETID || "";

          // Use service data directly - no need to fetch individual service details
          const serviceDetail: ApiService = service;

          // Fetch caretaker/user details
          // Check all possible fields for caretaker info in service data
          let staffName =
            serviceDetail.staff?.name ||
            serviceDetail.caretaker?.name ||
            serviceDetail.staff_name ||
            serviceDetail.caretaker_name ||
            service.staff?.name ||
            service.caretaker?.name ||
            service.staff_name ||
            service.caretaker_name;

          let staffAvatar: string | undefined =
            serviceDetail.staff?.profile_image ||
            serviceDetail.caretaker?.profile_image ||
            serviceDetail.staff_avatar ||
            serviceDetail.caretaker_avatar ||
            service.staff?.profile_image ||
            service.caretaker?.profile_image ||
            service.staff_avatar ||
            service.caretaker_avatar;

          // If still no name, use staff_id instead of "Caretaker"
          if (!staffName || staffName === "Caretaker") {
            staffName = staffId || "Unknown";
          }

          // Fetch pet details
          let petName = "Pet";
          if (petId) {
            const petInfo = await fetchPetDetails(petId, storedToken);
            if (petInfo) {
              petName = petInfo.name;
            }
          }

          return {
            service_id: serviceId,
            staff_id: staffId,
            staff_name: staffName,
            staff_avatar: staffAvatar,
            pet_id: petId,
            pet_name: petName,
            reserve_date_start:
              serviceDetail.reserve_date_start ||
              serviceDetail.rdate_start ||
              service.reserve_date_start ||
              service.rdate_start ||
              "",
            reserve_date_end:
              serviceDetail.reserve_date_end ||
              serviceDetail.rdate_end ||
              service.reserve_date_end ||
              service.rdate_end ||
              "",
            status: serviceDetail.status || service.status || "",
            has_review: false,
          };
        })
    );
  } catch (err) {
    console.error("Error fetching unreviewed services:", err);
    throw err;
  }
};

/**
 * Fetch services that have been reviewed (completed reviews)
 */
export const getReviewedServices = async (): Promise<ServiceReview[]> => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!storedToken) {
    console.error("No authentication token found");
    throw new Error("Authentication required");
  }

  try {
    // Try to fetch from the cservice reviews endpoint
    let reviews: ApiReview[] = [];

    try {
      const response = await fetch(`${reviewURL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        reviews = (json.data || json || []) as ApiReview[];
      }
    } catch {
      // Error fetching from /cservice/ endpoint, will try alternative method
    }

    // If no reviews from cservice, try to get them from services that have reviews
    if (reviews.length === 0) {
      try {
        // Fetch all finished services and check which ones have reviews
        const servicesResponse = await fetch(
          `${serviceURL}?status=finish&page=1&limit=100`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          const allServices =
            servicesData.data?.services || servicesData.services || [];

          // Check each service individually to see if it has a review
          // We'll fetch service details to check for review_score or review fields
          const servicesWithReviews = await Promise.all(
            (allServices as ApiService[]).map(async (service) => {
              const serviceId = service.service_id || service.SID;
              try {
                const serviceDetailResponse = await fetch(
                  `${serviceURL}${serviceId}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${storedToken}`,
                    },
                  }
                );

                if (serviceDetailResponse.ok) {
                  const serviceDetailData = await serviceDetailResponse.json();
                  const serviceDetail =
                    serviceDetailData.data || serviceDetailData;

                  // Check if service has a review (has review_score or review field)
                  if (
                    serviceDetail.review_score !== undefined ||
                    serviceDetail.review ||
                    serviceDetail.rating !== undefined
                  ) {
                    const reviewData: ApiReview = {
                      SID: serviceId,
                      service_id: serviceId,
                      CID:
                        service.staff_id || service.CID || service.caretaker_id,
                      caretaker_id:
                        service.staff_id || service.CID || service.caretaker_id,
                      staff_id:
                        service.staff_id || service.CID || service.caretaker_id,
                      score:
                        serviceDetail.review_score ||
                        serviceDetail.rating ||
                        serviceDetail.review?.score,
                      rating:
                        serviceDetail.review_score ||
                        serviceDetail.rating ||
                        serviceDetail.review?.score,
                      comment:
                        serviceDetail.review_comment ||
                        serviceDetail.comment ||
                        serviceDetail.review?.comment,
                      service: serviceDetail,
                    };
                    return reviewData;
                  }
                }
              } catch {
                // Error checking service for review, skip it
              }
              return null;
            })
          );

          reviews = servicesWithReviews.filter(
            (r): r is ApiReview => r !== null
          );
        }
      } catch (err) {
        console.error("Error fetching services to check for reviews:", err);
      }
    }

    if (reviews.length === 0) {
      return [];
    }

    // Fetch service details and caretaker/pet info for each review
    const reviewedServices: ServiceReview[] = await Promise.all(
      reviews
        .filter((review) => {
          // Only process reviews with valid service IDs
          return !!(review.SID || review.service_id);
        })
        .map(async (review) => {
          const serviceId = review.SID || review.service_id || "";
          const caretakerId =
            review.CID || review.caretaker_id || review.staff_id || "";

          // Use service data if already available (from direct service fetch)
          let serviceDetail: ApiService = review.service || {};

          // If we don't have service detail, fetch it
          if (!serviceDetail.service_id && !serviceDetail.SID) {
            try {
              const serviceResponse = await fetch(`${serviceURL}${serviceId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${storedToken}`,
                },
              });

              if (serviceResponse.ok) {
                const serviceData = await serviceResponse.json();
                serviceDetail = (serviceData.data || serviceData) as ApiService;
              }
            } catch {
              // Error fetching service, continue with available data
            }
          }

          const petId = serviceDetail.pet_id || serviceDetail.PETID;

          // Fetch caretaker/user details - check all possible fields
          let staffName =
            serviceDetail.staff?.name ||
            serviceDetail.caretaker?.name ||
            serviceDetail.staff_name ||
            serviceDetail.caretaker_name;

          let staffAvatar: string | undefined =
            serviceDetail.staff?.profile_image ||
            serviceDetail.caretaker?.profile_image ||
            serviceDetail.staff_avatar ||
            serviceDetail.caretaker_avatar;

          // If still no name, use staff_id instead of "Caretaker"
          if (!staffName || staffName === "Caretaker") {
            staffName = caretakerId || "Unknown";
          }

          // Fetch pet details
          let petName = "Pet";
          const finalPetId = petId || "";
          if (finalPetId) {
            const petInfo = await fetchPetDetails(finalPetId, storedToken);
            if (petInfo) {
              petName = petInfo.name;
            }
          }

          return {
            service_id: serviceId,
            staff_id: caretakerId,
            staff_name: staffName,
            staff_avatar: staffAvatar,
            pet_id: finalPetId,
            pet_name: petName,
            reserve_date_start:
              serviceDetail.reserve_date_start ||
              serviceDetail.rdate_start ||
              "",
            reserve_date_end:
              serviceDetail.reserve_date_end || serviceDetail.rdate_end || "",
            status: serviceDetail.status || "completed",
            has_review: true,
            review_score:
              review.score ||
              review.rating ||
              serviceDetail.review_score ||
              serviceDetail.rating,
            review_comment:
              review.comment ||
              review.review_comment ||
              serviceDetail.review_comment ||
              serviceDetail.comment,
          };
        })
    );

    return reviewedServices;
  } catch (err) {
    console.error("Error fetching reviewed services:", err);
    throw err;
  }
};

/**
 * Submit a rating for a service
 * Based on Swagger: PATCH /services/review/{serviceID}
 */
export const submitRating = async (
  review: ReviewSubmission
): Promise<ReviewResponse> => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!storedToken) {
    throw new Error("Authentication required");
  }

  try {
    const patchUrl = `${serviceURL}review/${review.SID}`;

    const patchResponse = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        score: review.score,
        comment: review.comment || "",
      }),
    });

    if (patchResponse.ok) {
      const json = await patchResponse.json();
      return {
        message: json.message || "Rating submitted successfully",
        status: json.status || patchResponse.status,
        data: json.data,
      };
    }

    // Handle errors
    const errorText = await patchResponse.text().catch(() => "");
    let errorData: { message?: string } = {};
    try {
      errorData = (await patchResponse.json()) as { message?: string };
    } catch {
      errorData = { message: errorText || patchResponse.statusText };
    }

    console.error("PATCH endpoint failed:", {
      status: patchResponse.status,
      statusText: patchResponse.statusText,
      errorText,
      errorData,
      url: patchUrl,
    });

    if (patchResponse.status === 403) {
      let errorMessage =
        errorData.message ||
        "You don't have permission to review this service.";

      if (errorData.message && errorData.message.includes("role")) {
        errorMessage = `Invalid role. ${errorData.message}. Please ensure you are logged in as an owner and own this service.`;
      } else if (errorData.message && errorData.message.includes("finished")) {
        errorMessage =
          "This service is not finished yet. You can only review completed services.";
      }

      throw new Error(errorMessage);
    }

    if (patchResponse.status === 400) {
      const errorMessage =
        errorData.message ||
        "Invalid request. Please make sure you provide a valid rating (1-5).";
      throw new Error(errorMessage);
    }

    throw new Error(
      errorData.message ||
        `Failed to submit rating: ${patchResponse.status} - ${
          errorText || patchResponse.statusText
        }`
    );
  } catch (err) {
    console.error("Error submitting rating:", err);
    throw err;
  }
};

/**
 * Fetch all caretakers who have served services for the current owner
 */
export interface CaretakerInfo {
  user_id: string;
  name: string;
  profile_image?: string;
  service_count: number;
  last_service_date?: string;
}

export const getCaretakersForOwner = async (): Promise<CaretakerInfo[]> => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!storedToken) {
    console.error("No authentication token found");
    throw new Error("Authentication required");
  }

  try {
    // Fetch all services for the current owner
    const response = await fetch(`${serviceURL}?page=1&limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch services:", response.status, errorText);
      throw new Error(
        `Failed to fetch services: ${response.status} - ${errorText}`
      );
    }

    const json = await response.json();
    const services = json.data?.services || json.services || [];

    if (services.length === 0) {
      return [];
    }

    // Extract unique caretaker IDs and count services per caretaker
    const caretakerMap = new Map<
      string,
      { service_count: number; last_service_date?: string }
    >();

    for (const service of services) {
      const caretakerId =
        service.staff_id || service.CID || service.caretaker_id;
      if (caretakerId) {
        const existing = caretakerMap.get(caretakerId) || { service_count: 0 };
        existing.service_count += 1;

        // Track the most recent service date
        const serviceDate = service.reserve_date_start || service.rdate_start;
        if (serviceDate) {
          if (
            !existing.last_service_date ||
            serviceDate > existing.last_service_date
          ) {
            existing.last_service_date = serviceDate;
          }
        }

        caretakerMap.set(caretakerId, existing);
      }
    }

    // Fetch details for each caretaker
    // First, try to get caretaker names from service data if available
    const caretakerNameMap = new Map<string, string>();
    const caretakerAvatarMap = new Map<string, string>();

    // Extract caretaker names from services if they're included
    for (const service of services) {
      const caretakerId =
        service.staff_id || service.CID || service.caretaker_id;
      if (caretakerId) {
        // Check if service has caretaker name directly
        if (service.staff_name || service.caretaker_name) {
          if (!caretakerNameMap.has(caretakerId)) {
            caretakerNameMap.set(
              caretakerId,
              service.staff_name || service.caretaker_name
            );
          }
        }
        if (service.staff_avatar || service.caretaker_avatar) {
          if (!caretakerAvatarMap.has(caretakerId)) {
            caretakerAvatarMap.set(
              caretakerId,
              service.staff_avatar || service.caretaker_avatar
            );
          }
        }
      }
    }

    // Fetch details for each caretaker
    const caretakers: CaretakerInfo[] = await Promise.all(
      Array.from(caretakerMap.entries()).map(async ([caretakerId, info]) => {
        // Use name from service data if available
        let caretakerName =
          caretakerNameMap.get(caretakerId) || "Unknown Caretaker";
        let caretakerAvatar = caretakerAvatarMap.get(caretakerId);

        return {
          user_id: caretakerId,
          name: caretakerName,
          profile_image: caretakerAvatar,
          service_count: info.service_count,
          last_service_date: info.last_service_date,
        };
      })
    );

    // Sort by last service date (most recent first)
    caretakers.sort((a, b) => {
      if (!a.last_service_date) return 1;
      if (!b.last_service_date) return -1;
      return b.last_service_date.localeCompare(a.last_service_date);
    });

    return caretakers;
  } catch (err) {
    console.error("Error fetching caretakers for owner:", err);
    throw err;
  }
};

/**
 * Fetch staff score and reviews summary
 * GET /services/staff/{staffID}/score
 */
export const getStaffReviewSummary = async (
  staffID: string
): Promise<StaffReviewSummary> => {
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!storedToken) {
    console.error("No authentication token found");
    throw new Error("Authentication required");
  }

  if (!staffID) {
    throw new Error("Staff ID is required");
  }

  try {
    const response = await fetch(`${serviceURL}staff/${staffID}/score`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch staff reviews:",
        response.status,
        errorText
      );
      throw new Error(
        `Failed to fetch staff reviews: ${response.status} - ${errorText}`
      );
    }

    const json = await response.json();
    const data = json.data || json;

    // Transform API response to our interface
    // The API might return different field names, so we check multiple possibilities
    const averageScore =
      data.average_score || data.avg_score || data.score || data.rating || 0;

    const reviewCount =
      data.review_count ||
      data.reviews_count ||
      data.count ||
      (data.reviews && data.reviews.length) ||
      0;

    // Transform reviews array
    const reviews: StaffReviewItem[] = (data.reviews || []).map(
      (review: {
        date?: string;
        created_at?: string;
        review_date?: string;
        comment?: string;
        review_comment?: string;
        score?: number;
        rating?: number;
      }) => ({
        date: review.date || review.created_at || review.review_date || "",
        comment: review.comment || review.review_comment || "",
        score: review.score || review.rating || 0,
      })
    );

    // Calculate years as member if we have created_at
    let yearsAsMember: number | undefined;
    if (data.created_at || data.member_since) {
      const createdDate = new Date(data.created_at || data.member_since);
      const now = new Date();
      const years =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      yearsAsMember = Math.floor(years);
    }

    return {
      average_score: averageScore,
      review_count: reviewCount,
      reviews: reviews,
      years_as_member: yearsAsMember,
    };
  } catch (err) {
    console.error("Error fetching staff review summary:", err);
    throw err;
  }
};
