export interface Profile {
  name: string;
  user_id: string;
  telephone_number: string;
  email: string;
  created_at: string;
  birth_date: string;
  address: string;
}

export interface Pet {
  pet_id: string;
  owner_id: string;
  breed: string;
  name: string;
  birth_date: string;
  weight: string;
  kind: string;
  sex: string;
}

export interface PetsResponse {
  massage: string;
  data: {
    amount: number;
    pets: Pet[];
  };
  status: number;
}

export interface DayInfo {
  date: string;
  dayOfMonth: number;
  isToday: boolean;
  isSelected: boolean;
  hasBooking: boolean;
  badges: string[];
  isDisabled: boolean;
}
