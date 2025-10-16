export interface Reservation {
  service_id: string;
  owner_id: string;
  pet_id: string;
  payment_id: string;
  price: number;
  status: string;
  reserve_date: string;
}