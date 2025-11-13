import { apiFetch } from "@/utils/api";
import {
  AvailabilityRequest,
  AvailabilityResponse,
  StripeSessionRequest,
  StripeSessionResponse,
  PaymentVerificationResponse,
  Staff,
} from "@/interfaces/reservationFlowInterface";

// Check availability for staff
export const checkAvailability = async (
  request: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  return apiFetch<AvailabilityResponse>("/reservation/check-availability", {
    method: "POST",
    body: JSON.stringify(request),
  });
};

// Create Stripe checkout session
export const createStripeSession = async (
  request: StripeSessionRequest
): Promise<StripeSessionResponse> => {
  return apiFetch<StripeSessionResponse>("/reservation/create-stripe-session", {
    method: "POST",
    body: JSON.stringify(request),
  });
};

// Verify payment after Stripe redirect
export const verifyPayment = async (
  sessionId: string
): Promise<PaymentVerificationResponse> => {
  return apiFetch<PaymentVerificationResponse>(
    `/reservation/verify-payment?session_id=${sessionId}`,
    {
      method: "GET",
    }
  );
};

// Get list of available staff
export const getStaffList = async (): Promise<Staff[]> => {
  return apiFetch<Staff[]>("/staff/list", {
    method: "GET",
  });
};

// Get staff details
export const getStaffDetails = async (staffId: string): Promise<Staff> => {
  return apiFetch<Staff>(`/staff/${staffId}`, {
    method: "GET",
  });
};

