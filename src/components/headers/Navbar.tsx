import Link from "next/link";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Pet sitting", path: "/pet-sitting" },
  { name: "Reservation", path: "/reservation" },
  { name: "Review", path: "/review" },
  { name: "Profile", path: "/profile" },
  { name: "Setting", path: "/setting" },
];

function NavBar() {
  return (
    <div className="flex flex-row items-center w-full pl-[150px] gap-[100px]">
      {navItems.map((item) => (
        <Link className="text-[#777B83]" key={item.path} href={item.path}>
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default NavBar;
