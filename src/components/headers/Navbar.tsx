import './Navbar.css'
import Link from 'next/link';

const navItems = [
    {name: "Home", path: "/"},
    {name:"Pet sitting", path: "/pet-sitting"},
    {name:"Reservation", path: "/reservation"},
    {name:"Review", path: "/review"},
    {name:"Profile", path: "/profile"},
    {name:"Setting", path: "/setting"},
];

function NavBar() {
  return (
    <div className="NavBar">
        {navItems.map((item) => (
          <Link className="Nav" key={item.path} href={item.path}>
            {item.name}
          </Link>
        ))}
    </div>
  );
}

export default NavBar;