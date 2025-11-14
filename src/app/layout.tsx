import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Headers/Header";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "LAMA Pet Care",
  description: "Pet care management platform",
};

import { RoleProvider } from "@/context/RoleContext";
import { ReservationSelectionProvider } from "@/context/ReservationSelectionContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <RoleProvider>
          <ReservationSelectionProvider>
            <Header />
            {children}
          </ReservationSelectionProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
