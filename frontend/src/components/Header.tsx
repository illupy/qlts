// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import { CgMenuLeft } from "react-icons/cg";
// import { useEffect, useState } from "react";
// import { TbUserCircle } from "react-icons/tb";
// import { RiUserLine } from "react-icons/ri";

// const Header = () => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(""); // Replace with your token logic
//   const [active, setActive] = useState(false);
//   const [menuOpened, setMenuOpened] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpened((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 0) {
//         setMenuOpened(false);
//       }
//       setActive(window.scrollY > 30);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className="fixed top-0 left-0 w-full z-50">
//       <div
//         className={`${
//           active ? "bg-white py-2.5 shadow-md" : "py-3"
//         } transition-all duration-300 border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex justify-between items-center`}
//       >
//         {/* Navbar */}
//         <div className="flex-1">
//           <Navbar
//             containerStyles={
//               menuOpened
//                 ? "flex flex-col gap-y-16 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-xl"
//                 : "xl:flex hidden justify-center gap-x-8 xl:gap-x-14 text-sm"
//             }
//             menuOpened={menuOpened}
//             toggleMenu={toggleMenu}
//           />
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-x-4 justify-end">
//           {/* Mobile menu icon */}
//           <CgMenuLeft
//             onClick={toggleMenu}
//             className="text-2xl xl:hidden cursor-pointer"
//           />

//           {/* User Section */}
//           <div>
//             <div
//               onClick={() => {
//                 if (!token) navigate("/login");
//               }}
//               className="relative group"
//             >
//               {token ? (
//                 <div>
//                   <TbUserCircle className="text-[28px] cursor-pointer" />
//                 </div>
//               ) : (
//                 <button className="btn-outline flex items-center gap-x-2 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition text-sm">
//                   Login <RiUserLine />
//                 </button>
//               )}

//               {/* Dropdown menu if logged in */}
//               {token && (
//                 <ul className="absolute right-0 top-8 bg-white p-2 w-32 ring-1 ring-gray-200 rounded shadow-md hidden group-hover:flex flex-col text-sm">
//                   <li className="p-2 hover:bg-gray-100 cursor-pointer rounded">Orders</li>
//                   <li className="p-2 hover:bg-gray-100 cursor-pointer rounded">Logout</li>
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useEffect, useRef, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Header = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Có thể log lỗi nếu cần
    }
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full h-16 bg-white flex items-center justify-between px-4 z-40">
      <button onClick={() => setCollapsed(!collapsed)} className="text-2xl">
        <CgMenuLeft />
      </button>

      <div className="relative" ref={dropdownRef}>
        {/* Profile Section */}
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium leading-4">
              {user ? user.name : "Guest"}
            </div>
            <div className="text-xs text-gray-500">{user?.role ?? "guest"}</div>
          </div>
          <FaChevronDown className="text-xs ml-1" />
        </button>

        {/* Dropdown */}
        {openDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg py-3 z-50">
            {/* Hiển thị email người dùng */}
            <div className="px-4 pb-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.email}
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 w-full text-left text-sm text-red-500 font-medium transition-all"
            >
              <FaSignOutAlt className="text-red-400" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
