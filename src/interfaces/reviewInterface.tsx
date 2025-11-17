export interface ServiceReview {
  service_id: string;
  staff_id: string;
  staff_name: string;
  staff_avatar?: string;
  pet_id: string;
  pet_name: string;
  reserve_date_start: string;
  reserve_date_end: string;
  status: string;
  has_review: boolean;
  review_score?: number;
  review_comment?: string;
}

export interface ReviewSubmission {
  SID: string; // Service ID
  CID: string; // Caretaker ID (staff_id)
  score: number; // Rating 1-5
  comment?: string; // Optional comment
}

export interface ReviewResponse {
  message: string;
  status: number;
  data?: unknown;
}

export interface ServiceReviewResponse {
  message: string;
  status: number;
  data: {
    services: ServiceReview[];
    amount: number;
  };
}

export interface StaffReviewItem {
  date: string;
  comment: string;
  score: number;
}

export interface StaffReviewSummary {
  average_score: number;
  review_count: number;
  reviews: StaffReviewItem[];
  years_as_member?: number;
}

