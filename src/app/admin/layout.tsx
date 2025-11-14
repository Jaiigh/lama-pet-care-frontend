import type { ReactNode } from "react";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";

export const metadata = {
  title: "Admin | LAMA Pet Care",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="bg-slate-50">
      <AdminSessionProvider>{children}</AdminSessionProvider>
    </section>
  );
}
