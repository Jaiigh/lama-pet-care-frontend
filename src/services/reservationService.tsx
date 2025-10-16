import { Reservation } from "@/interfaces/reservationInterface";

import { environment } from "@/env/environment";

const reservationURL = environment.masterUrl + environment.APIversion + "services/";

export const getReservation = async (token: string): Promise<Reservation[]> => {
  try {
    const response = await fetch(reservationURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch reservation:", response.statusText);
      throw new Error("Failed to fetch reservation");
    }
    const json = await response.json();
    const data = json.data;
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error fetching reservation:", err);
    throw err;
  }
};