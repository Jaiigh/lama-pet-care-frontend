import type { ReactNode } from "react";

export const metadata = {
  title: "Admin | LAMA Pet Care",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <section className="bg-slate-50">{children}</section>;
}
