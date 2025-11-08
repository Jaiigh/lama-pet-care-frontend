"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  role?: string;
};

export default function Siderbar({ role: roleProp }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(roleProp ?? null);

  useEffect(() => {
    if (!roleProp && typeof window !== "undefined") {
      const stored = localStorage.getItem("role");
      if (stored) setRole(stored);
    }
  }, [roleProp]);

  const toggle = () => setCollapsed((c) => !c);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
  ];

  if (role?.toLowerCase() === "doctor") {
    links.push({ label: "Patients", href: "/doctor/patients" });
    links.push({ label: "Schedule", href: "/doctor/schedule" });
  }

  return (
    <aside
      className={`bg-white border-r h-full min-h-screen transition-width duration-200 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-[#D89B76] text-white rounded-md w-8 h-8 flex items-center justify-center font-bold">
            L
          </div>
          {!collapsed && <span className="font-semibold">Lama</span>}
        </div>
        <button onClick={toggle} aria-label="Toggle sidebar" className="p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18"></path>
            <path d="M3 6h18"></path>
            <path d="M3 18h18"></path>
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 ${collapsed ? "justify-center" : ""}`}>
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                {!collapsed && <span>{l.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t pt-4">
          <Link href={role ? `/auth/login?role=${encodeURIComponent(role)}` : "/auth/login"} className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 ${collapsed ? "justify-center" : ""}`}>
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
            </svg>
            {!collapsed && <span>Login{role ? ` (${role})` : ''}</span>}
          </Link>

          <Link href="/auth/register" className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 mt-2 ${collapsed ? "justify-center" : ""}`}>
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20"></path>
              <path d="M5 11h14"></path>
            </svg>
            {!collapsed && <span>Register</span>}
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t">
        <button onClick={handleLogout} className={`w-full text-left p-2 rounded hover:bg-gray-100 ${collapsed ? "flex justify-center" : ""}`}>
          <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <path d="M16 17l5-5-5-5"></path>
            <path d="M21 12H9"></path>
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
