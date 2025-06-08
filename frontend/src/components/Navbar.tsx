import { FaRegWindowClose } from "react-icons/fa";
import { IoLibrary, IoMailOpen } from "react-icons/io5";
import { TbHomeFilled } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  containerStyles: string;
  menuOpened?: boolean;
  toggleMenu?: () => void;
}

const Navbar = ({containerStyles, menuOpened, toggleMenu}: NavbarProps) => {
  const navItems = [
    { to: "/", label: "Home", icon: <TbHomeFilled /> },
    { to: "/shop", label: "Shop", icon: <IoLibrary /> },
    { to: "mailto:tailuuduc2004@gmail.com", label: "Contact", icon: <IoMailOpen /> },
  ];
  return (<nav className={containerStyles}>
    {/* close button inside navbar */}
    {menuOpened && (
      <>  
        <FaRegWindowClose onClick={toggleMenu} className="text-xl cursor-pointer self-end relative left-8" />
        <Link className="bold-24 mb-10" to={"/"}>
          <h4 className="text-secondary">illupy</h4>
        </Link>
      </>
    )}

    {navItems.map((item) => (
      <div key={item.label} className="inline-flex relative top-1">
        <NavLink to={item.to} className={({isActive}) => isActive ? "active-link flexCenter gap-x-2" : "flexCenter gap-x-2"}>
          <span className="text-xl">{item.icon}</span>
          <span className="medium-16">{item.label}</span>
        </NavLink>
      </div>
    ))}
    </nav>
    );
};
export default Navbar;
