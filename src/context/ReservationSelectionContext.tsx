"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ReservationMode } from "@/interfaces/reservationFlowInterface";

export interface ReservationSelection {
  mode: ReservationMode | null;
  /** Single date for within-day reservations (YYYY-MM-DD) */
  date: string | null;
  /** Start date for full-day reservations (YYYY-MM-DD) */
  startDate: string | null;
  /** End date for full-day reservations (YYYY-MM-DD) */
  endDate: string | null;
  /** Selected service type e.g. doctor or caretaker */
  serviceType: "mservice" | "cservice" | null;
  /** Selected pet id */
  petId: string | null;
  /** Selected staff id */
  staffId: string | null;
  /** Selected time slot for within-day (HH:mm) */
  timeSlot: string[]; // now allow multiple selections
}

const DEFAULT_SELECTION: ReservationSelection = {
  mode: null,
  date: null,
  startDate: null,
  endDate: null,
  serviceType: null,
  petId: null,
  staffId: null,
  timeSlot: [],
};

interface ReservationSelectionContextType {
  selection: ReservationSelection;
  updateSelection: (payload: Partial<ReservationSelection>) => void;
  resetSelection: () => void;
}

const ReservationSelectionContext =
  createContext<ReservationSelectionContextType | null>(null);

const STORAGE_KEY = "reservation-selection";

export const ReservationSelectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selection, setSelection] =
    useState<ReservationSelection>(DEFAULT_SELECTION);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ReservationSelection>;
        const parsedTimeSlot = parsed?.timeSlot;
        const normalizedTimeSlot = Array.isArray(parsedTimeSlot)
          ? parsedTimeSlot
          : typeof parsedTimeSlot === "string"
          ? [parsedTimeSlot]
          : [];

        setSelection({
          ...DEFAULT_SELECTION,
          ...parsed,
          timeSlot: normalizedTimeSlot,
        });
      }
    } catch (error) {
      console.warn("Failed to parse reservation selection cache", error);
    }
  }, []);

  const persist = (next: ReservationSelection) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist reservation selection", error);
    }
  };

  const updateSelection = (payload: Partial<ReservationSelection>) => {
    setSelection((prev) => {
      const payloadTimeSlot = payload.timeSlot;
      const normalizedPayloadTimeSlot =
        payloadTimeSlot === undefined
          ? prev.timeSlot
          : Array.isArray(payloadTimeSlot)
          ? payloadTimeSlot
          : typeof payloadTimeSlot === "string"
          ? [payloadTimeSlot]
          : [];

      const next: ReservationSelection = {
        ...prev,
        ...payload,
        timeSlot: normalizedPayloadTimeSlot,
      };
      persist(next);
      return next;
    });
  };

  const resetSelection = () => {
    setSelection(DEFAULT_SELECTION);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      selection,
      updateSelection,
      resetSelection,
    }),
    [selection]
  );

  return (
    <ReservationSelectionContext.Provider value={value}>
      {children}
    </ReservationSelectionContext.Provider>
  );
};

export const useReservationSelection = () => {
  const context = useContext(ReservationSelectionContext);
  if (!context) {
    throw new Error(
      "useReservationSelection must be used within a ReservationSelectionProvider"
    );
  }
  return context;
};
