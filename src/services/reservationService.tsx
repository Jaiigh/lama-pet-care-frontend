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

  console.log("Fetching all reservations...");

  while (hasMorePages) {
      const response = await getSinglePageReservation(currentPage, 5);
      const reservations = response.data.services;
      if(currentPage === 1) {
        amountOfItems = response.data.amount;
      }

      allReservations = [...allReservations, ...reservations];

      if(allReservations.length >=amountOfItems) {
        hasMorePages = false;
      }else{
        currentPage++;
      }

      if(amountOfItems === 0) {
        hasMorePages = false;
      }
  }

  console.log("Total reservations fetched:", allReservations.length);
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
