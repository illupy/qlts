// MainLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white flex-shrink-0 overflow-y-auto">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
