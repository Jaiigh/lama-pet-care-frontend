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
  const limit = 100;

  console.log("Fetching all payments...");

  while (hasMorePages) {
      const response = await getSinglePagePayment(currentPage, limit);
      const payments = response.data?.payments || [];
      
      if(currentPage === 1) {
        amountOfItems = response.data?.amount || 0;
        console.log("Total payments reported by backend:", amountOfItems);
      }

      // Add payments from this page
      if (payments.length > 0) {
        allPayments = [...allPayments, ...payments];
        console.log(`Page ${currentPage}: Fetched ${payments.length} payments. Total so far: ${allPayments.length}`);
      }

      // Stop if no more items on this page
      if (payments.length === 0) {
        hasMorePages = false;
        console.log("No more payments on page", currentPage);
      }
      // Stop if we've fetched all items according to backend
      else if (amountOfItems > 0 && allPayments.length >= amountOfItems) {
        hasMorePages = false;
        console.log("Fetched all payments according to backend count");
      }
      // Stop if backend reported 0 items
      else if (amountOfItems === 0 && currentPage === 1) {
        hasMorePages = false;
        console.log("Backend reported 0 payments");
      }
      // Continue to next page
      else {
        currentPage++;
        // Safety check: don't loop forever (max 1000 pages = 100,000 items)
        if (currentPage > 1000) {
          console.warn("Reached maximum page limit (1000). Stopping pagination.");
          hasMorePages = false;
        }
      }
  }

  console.log("Total payments fetched:", allPayments.length, "out of", amountOfItems, "reported by backend");
  return allPayments;
};

