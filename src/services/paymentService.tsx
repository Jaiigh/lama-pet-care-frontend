import {
  Payment,
  PaymentApiResponse,
} from "@/interfaces/paymentInterface";

import { environment } from "@/env/environment";

const paymentURL = environment.masterUrl + "/payments/";

export const getSinglePagePayment = async (
  page: number,
  limit: number
): Promise<PaymentApiResponse> => {
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const urlWithPage = `${paymentURL}?page=${page}&limit=${limit}`;
  try {
    const response = await fetch(urlWithPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch page ${page}:`, response.statusText);
            throw new Error(`Failed to fetch payment page ${page}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  }
  catch (err) {
    console.error("Error fetching payment:", err);
    throw err;
  }
};

export const getAllPayment = async (): Promise<Payment[]> => {
  let allPayments: Payment[] = [];
  let currentPage = 1;
  let amountOfItems = 0;
  let hasMorePages = true;

  console.log("Fetching all payments...");

  while (hasMorePages) {
      const response = await getSinglePagePayment(currentPage, 5);
      const payments = response.data.payments;
      if(currentPage === 1) {
        amountOfItems = response.data.amount;
      }

      allPayments = [...allPayments, ...payments];

      if(allPayments.length >= amountOfItems) {
        hasMorePages = false;
      }else{
        currentPage++;
      }

      if(amountOfItems === 0) {
        hasMorePages = false;
      }
  }

  console.log("Total reservations fetched:", allPayments.length);
  return allPayments;
};

