export interface Payment {
  payment_id: string;
  owner_id: string;
  status: string;
  price: number;
  type: string;
  pay_date: string;
}

export interface PaymentApiResponse {
    massage: string;
    data: {
      amount: number;
      page: number;
      payments: Payment[];
    };
    status: number;
}