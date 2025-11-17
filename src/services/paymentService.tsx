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
      // Return empty data instead of throwing to prevent breaking the page
      console.warn(`Failed to fetch payment page ${page}:`, response.statusText);
      return {
        data: {
          payments: [],
          amount: 0,
        },
        status: response.status,
      } as PaymentApiResponse;
    }

    const json = await response.json();
    console.log(json);
    return json;
  }
  catch (err) {
    // Return empty data instead of throwing to prevent breaking the page
    console.warn("Error fetching payment:", err);
    return {
      data: {
        payments: [],
        amount: 0,
      },
      status: 500,
    } as PaymentApiResponse;
  }
};

export const getAllPayment = async (): Promise<Payment[]> => {
  let allPayments: Payment[] = [];
  let currentPage = 1;
  let amountOfItems = 0;
  let hasMorePages = true;

  console.log("Fetching all payments...");

  try {
    while (hasMorePages) {
      const response = await getSinglePagePayment(currentPage, 5);
      const payments = response.data?.payments || [];
      
      if(currentPage === 1) {
        amountOfItems = response.data?.amount || 0;
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

    console.log("Total payments fetched:", allPayments.length);
    return allPayments;
  } catch (err) {
    // Return empty array instead of throwing to prevent breaking the page
    console.warn("Error fetching all payments:", err);
    return [];
  }
};

