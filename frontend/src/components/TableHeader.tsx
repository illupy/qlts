import { TbPlus, TbRefresh } from "react-icons/tb";
import { FaFileExcel } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { usePermissions } from "../hooks/UsePermissions";
interface TableHeaderProps {
  title: string;
  onAdd?: () => void;
  onImport?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  onAdd,
  onImport,
  onRefresh,
  onExport,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const { canCUD } = usePermissions();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target as Node)
      ) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex items-center space-x-2">
        {/* Add Button Group */}
        {canCUD && (
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <TbPlus className="mr-2 text-lg" />
              <span className="mr-2">Thêm</span>
              <div className="w-px h-4 bg-white/40 mx-2" />
              <IoChevronDown />
            </button>
            {showAddMenu && (
              <div className="absolute right-0 top-8 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <button
                  onClick={onAdd}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  Thêm mới
                </button>
                {onImport && (
                  <button
                    onClick={onImport}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                  >
                    Import từ Excel
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Export Button Group */}
        {onExport && (
          <div className="relative">
            <button
              onClick={onExport}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center"
            >
              <FaFileExcel className="mr-2 text-green-600" />
              <span className="mr-2">Export Excel</span>
            </button>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center"
          title="Refresh"
        >
          <TbRefresh className="text-xl" />
          <span className="ml-2">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default TableHeader;
