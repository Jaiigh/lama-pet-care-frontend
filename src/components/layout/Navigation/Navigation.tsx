import Link from "next/link";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Profile", path: "/dashboard/profile" },
  { name: "Reservations", path: "/dashboard/reservations" },
  { name: "Settings", path: "/dashboard/settings" },
];

export const Navigation = () => {
  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="text-black/60 hover:text-black px-4 py-2 rounded-lg hover:bg-black/5"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
