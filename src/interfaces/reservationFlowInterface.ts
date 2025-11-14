// Reservation Flow Interfaces

export type ReservationMode = "full-day" | "within-day";

export interface Staff {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  specialization?: string;
  status: "online" | "available" | "fully-booked";
}

export interface AvailabilityRequest {
  mode: ReservationMode;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  date?: string; // YYYY-MM-DD (for within-day)
  staffId: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
  availableTimeSlots?: string[]; // For within-day mode (e.g., ["09:00", "10:00", "14:00"])
  conflictingDates?: string[]; // For full-day mode
}

export interface TimeSlot {
  time: string; // HH:mm format
  available: boolean;
}

export interface PaymentSummary {
  mode: ReservationMode;
  staffId: string;
  staffName: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  timeSlot?: string;
  totalNights?: number;
  baseRate: number;
  extraServices?: Array<{
    name: string;
    price: number;
  }>;
  totalAmount: number;
}

export interface StripeSessionRequest {
  mode: ReservationMode;
  staffId: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  timeSlot?: string;
  totalAmount: number;
}

export interface StripeSessionResponse {
  sessionId: string;
  url: string; // Stripe Checkout URL
}

export interface PaymentVerificationResponse {
  success: boolean;
  reservationCode?: string;
  reservationId?: string;
  message?: string;
}

