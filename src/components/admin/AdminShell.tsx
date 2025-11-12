"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/images/lamalogo.png";

type AdminShellProps = {
  title: string;
  children: ReactNode;
  description?: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Services", href: "/admin/services", icon: ClipboardList },
];

export default function AdminShell({
  title,
  description,
  children,
}: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#E6F5EE]">
      <aside className="w-64 shrink-0 border-r border-emerald-100 bg-white">
        <div className="flex items-center gap-3 border-b border-emerald-50 px-6 py-4">
          <Image src={Logo} width={96} height={32} alt="LAMA logo" priority />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              LAMA
            </p>
            <p className="text-lg font-semibold text-slate-900">Admin</p>
          </div>
        </div>

        <nav className="space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`h-5 w-1 rounded-full ${
                    active ? "bg-emerald-500" : "bg-transparent group-hover:bg-emerald-200"
                  }`}
                />
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-emerald-100 bg-white px-8 py-3 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                นายบริรักษ์ จงกมล
              </p>
              <p className="text-xs text-emerald-600">Admin</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emerald-200">
                <Image
                  src="/assets/images/logo.png"
                  alt="Admin profile"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#E6F5EE] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
