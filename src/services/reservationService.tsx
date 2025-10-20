import {
  ReservationApiResponse,
} from "@/interfaces/reservationInterface";

import { environment } from "@/env/environment";

const reservationURL = environment.masterUrl + "/services/";

export const getReservation = async (
  token: string | null
): Promise<ReservationApiResponse> => {
  try {
    const response = await fetch(reservationURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch reservation:", response.statusText);
      throw new Error("Failed to fetch reservation");
    }
    const json = await response.json();
    console.log(json);
    return json;
  } catch (err) {
    console.error("Error fetching reservation:", err);
    throw err;
  }
};
