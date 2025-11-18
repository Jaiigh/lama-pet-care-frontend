import {
  Reservation,
  ReservationApiResponse,
} from "@/interfaces/reservationInterface";

import { environment } from "@/env/environment";

const reservationURL = environment.masterUrl + "/services/";

export const getSinglePageReservation = async (
  page: number,
  limit: number
): Promise<ReservationApiResponse> => {
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const urlWithPage = `${reservationURL}?page=${page}&limit=${limit}`;
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
            throw new Error(`Failed to fetch reservation page ${page}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  }
  catch (err) {
    console.error("Error fetching reservation:", err);
    throw err;
  }
};


export const getAllReservation = async (): Promise<Reservation[]> => {
  let allReservations: Reservation[] = [];
  let currentPage = 1;
  let amountOfItems = 0;
  let hasMorePages = true;
  const limit = 100;

  console.log("Fetching all reservations...");

  while (hasMorePages) {
      const response = await getSinglePageReservation(currentPage, limit);
      const reservations = response.data?.services || [];
      
      if(currentPage === 1) {
        amountOfItems = response.data?.amount || 0;
        console.log("Total items reported by backend:", amountOfItems);
      }

      // Add reservations from this page
      if (reservations.length > 0) {
        allReservations = [...allReservations, ...reservations];
        console.log(`Page ${currentPage}: Fetched ${reservations.length} reservations. Total so far: ${allReservations.length}`);
      }

      // Stop if no more items on this page
      if (reservations.length === 0) {
        hasMorePages = false;
        console.log("No more reservations on page", currentPage);
      }
      // Stop if we've fetched all items according to backend
      else if (amountOfItems > 0 && allReservations.length >= amountOfItems) {
        hasMorePages = false;
        console.log("Fetched all items according to backend count");
      }
      // Stop if backend reported 0 items
      else if (amountOfItems === 0 && currentPage === 1) {
        hasMorePages = false;
        console.log("Backend reported 0 items");
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

  console.log("Total reservations fetched:", allReservations.length, "out of", amountOfItems, "reported by backend");
  return allReservations;
};

export const updateReservationStatus = async (
  reservationId: string,
  newStatus: string
): Promise<boolean> => {
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  try {
    const updateReservationURL = `${reservationURL}${reservationId}/${newStatus}/`;
    const response = await fetch(updateReservationURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });
    if (!response.ok) {
      console.error(
        "Failed to update reservation status:",
        response.status,
        response.statusText
      );
      return false;
    }
    return true;
  }
  catch (err) {
    console.error("Error updating reservation status:", err);
    return false;
  }
};
