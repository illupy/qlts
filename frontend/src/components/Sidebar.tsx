// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//   const navItems = [
//     { name: 'Tổng quan', path: '/overview' },
//     { name: 'Nhóm tài sản', path: '/asset-group' },
//     { name: 'Loại tài sản', path: '/asset-type' },
//     { name: 'Dòng tài sản', path: '/asset-flow' },
//     { name: 'Đối tác', path: '/partner' },
//     { name: 'Hàng hóa / Dịch vụ', path: '/product' },
//   ]

//   return (
//     <aside className="w-64 bg-[#2D3E50] text-white flex flex-col">
//       {/* Logo section */}
//       <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700">
//         LOGO
//       </div>

//       {/* Navigation items */}
//       <nav className="flex-1 px-2 py-4 space-y-1">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg font-medium transition ${
//                 isActive
//                   ? 'bg-white text-[#2D3E50] font-semibold'
//                   : 'hover:bg-gray-700 hover:text-white'
//               }`
//             }
//           >
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   )
// }

// export default Sidebar

import { NavLink } from "react-router-dom";
import {
  TbCategory,
  TbShape,
  TbFileChart,
  TbBuildingCommunity,
  TbPackage,
  TbPresentationAnalytics ,
} from "react-icons/tb";
import logo from "../assets/logo.png";

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const navItems = [
    {
      name: "Tổng quan",
      path: "/",
      icon: <TbPresentationAnalytics/>,
    },
    {
      name: "Nhóm tài sản",
      path: "/asset-group",
      icon: <TbCategory />,
    },
    {
      name: "Loại tài sản",
      path: "/asset-type",
      icon: <TbShape />,
    },
    {
      name: "Dòng tài sản",
      path: "/asset-flow",
      icon: <TbFileChart />,
    },
    {
      name: "Đối tác",
      path: "/partner",
      icon: <TbBuildingCommunity />,
    },
    {
      name: "HHDV",
      path: "/product",
      icon: <TbPackage />,
    },
  ];

  return (
    <aside
      className={`bg-white text-gray-800 min-h-screen transition-all duration-150 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-center space-x-2 font-bold text-xl">
        <img
          src={logo}
          alt="Logo"
          className={`${collapsed ? "w-8" : "w-12"}`}
        />
        {!collapsed && <span> ilupy </span>}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition cursor-pointer
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-200 hover:text-blue-700 text-gray-700"
              }`
            }
            end
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
