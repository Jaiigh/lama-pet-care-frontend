export interface Profile {
  name: string;
  user_id: string;
  telephone_number: string;
  email: string;
  created_at: string;
  birth_date: string;
  address: string;
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
