import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  searchable?: boolean;
  searchAndSelect?: boolean;
  selectOptions?: { label: string; value: any }[];
  multiSelect?: boolean;
  sortable?: boolean;
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  orderBy?: keyof T;
  orderDirection?: "ASC" | "DESC";
  onSortChange?: (orderBy: keyof T, orderDirection: "ASC" | "DESC") => void;
  filters?: Partial<Record<keyof T, any>>;
  onFilterChange?: (key: keyof T, value: string) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onEdit?: (id: any, row: T) => void;
  onDelete?: (id: any, row: T) => void;
}

function DataTable<T extends object>({
  columns,
  data,
  orderBy,
  orderDirection = "DESC",
  onSortChange,
  filters = {},
  onFilterChange,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const [openDropdown, setOpenDropdown] = useState<String|null>(null);
  const handleSort = (colKey: keyof T) => {
    if (!onSortChange) return;
    if (orderBy === colKey) {
      onSortChange(colKey, orderDirection === "DESC" ? "ASC" : "DESC");
    } else {
      onSortChange(colKey, "DESC");
    }
  };
  // Xử lý hiển thị label cho multiSelect
  const getMultiSelectLabel = (col: Column<T>, value: any) => {
    if (!Array.isArray(value) || !col.selectOptions) return "";
    return col.selectOptions
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="overflow-x-auto">
        <table className="border text-sm w-full min-w-max min-h-64">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="border px-2 py-1 font-semibold bg-[#f5f5f5] cursor-pointer"
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{col.label}</span>
                    {col.sortable && orderBy === col.key && (
                      <span>{orderDirection === "DESC" ? "▼" : "▲"}</span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th
                  className="border px-2 py-1 font-semibold bg-[#f5f5f5]"
                  style={{
                    minWidth: 110,
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    background: "#f5f5f5",
                  }}
                >
                  Chức năng
                </th>
              )}
            </tr>
            {onFilterChange && (
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    className="border px-2 py-1 bg-[#f5f5f5]"
                  >
                    {col.searchAndSelect ? (
                        <div className="relative">
                          <div
                            tabIndex={0}
                            onFocus={() => setOpenDropdown(col.key as string)}
                            onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                          >
                            <input
                              type="text"
                              placeholder={`Chọn ${col.label}`}
                              value={
                                col.multiSelect
                                  ? getMultiSelectLabel(col, filters[col.key])
                                  : col.selectOptions?.find(
                                      (opt) => opt.value === filters[col.key]
                                    )?.label || (filters[col.key] || "")
                              }
                              readOnly={col.multiSelect}
                              onChange={
                                !col.multiSelect
                                  ? (e) => onFilterChange(col.key, e.target.value)
                                  : undefined
                              }
                              className="w-full border rounded px-1 py-0.5 text-xs"
                              autoComplete="off"
                              onClick={() => setOpenDropdown(col.key as string)}
                            />
                            {openDropdown === col.key && (
                              <div className="absolute left-0 right-0 bg-white border z-10 max-h-40 overflow-y-auto shadow">
                                {col.selectOptions &&
                                  col.selectOptions
                                    .filter((opt) =>
                                      !filters[col.key] ||
                                      (col.multiSelect
                                        ? true
                                        : opt.label
                                            .toLowerCase()
                                            .includes(
                                              (filters[col.key] || "")
                                            ))
                                    )
                                    .map((opt) => (
                                      <div
                                        key={opt.value}
                                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs flex items-center"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                          if (col.multiSelect) {
                                            const current = Array.isArray(filters[col.key])
                                              ? filters[col.key]
                                              : [];
                                            const exists= current.includes(opt.value);
                                            const next = exists
                                              ? current.filter((v: any) => v !== opt.value)
                                              : [...current, opt.value];
                                            onFilterChange(col.key, next);
                                          } else {
                                            onFilterChange(col.key, opt.value);
                                            setOpenDropdown(null);
                                          }
                                        }}
                                      >
                                        {col.multiSelect && (
                                          <input
                                            type="checkbox"
                                            checked={
                                              Array.isArray(filters[col.key]) &&
                                              filters[col.key].includes(opt.value)
                                            }
                                            readOnly
                                            className="mr-2"
                                          />
                                        )}
                                        {opt.label}
                                      </div>
                                    ))}
                                {col.selectOptions &&
                                  col.selectOptions.filter((opt) =>
                                    !filters[col.key]
                                      ? true
                                      : (col.multiSelect
                                          ? true
                                          : opt.label
                                              .toLowerCase()
                                              .includes(
                                                (filters[col.key] || "")
                                              ))
                                  ).length === 0 && (
                                    <div className="px-2 py-1 text-gray-400 text-xs">
                                      Không có dữ liệu
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : col.searchable && col.key === "status" ? (
                      <select
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          onFilterChange(col.key, e.target.value)
                        }
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : col.searchable && col.key === "managementType" ? (
                      <select
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          onFilterChange(col.key, e.target.value)
                        }
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="">All</option>
                        <option value="quantity">quantity</option>
                        <option value="code">code</option>
                      </select>
                    ) : col.searchable && col.key === "productType" ? (
                      <select
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          onFilterChange(col.key, e.target.value)
                        }
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="">All</option>
                        <option value="product">product</option>
                        <option value="service">service</option>
                      </select>
                    ) : col.searchable && col.key === "productGroup" ? (
                      <select
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          onFilterChange(col.key, e.target.value)
                        }
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      >
                        <option value="">All</option>
                        <option value="telecommunications">Viễn thông</option>
                        <option value="IT">CNTT</option>
                        <option value="RD">NCSX</option>
                        <option value="fixedasset">Mua sắm TSCĐ</option>
                        <option value="buildindorinfras">XD tòa nhà/CSHT</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : col.searchable ? (
                      <input
                        type="text"
                        placeholder={`Search ${String(col.label)}`}
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          onFilterChange(col.key, e.target.value)
                        }
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      />
                    ) : null}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th
                    className="border px-2 py-1 bg-[#f5f5f5]"
                    style={{
                      minWidth: 110,
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      background: "#f5f5f5",
                    }}
                  ></th>
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {data.map((row: any, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className="border px-2 py-1 align-top"
                    style={{
                      whiteSpace:
                        col.key === "partners" ? "pre-line" : "normal",
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td
                    className="border px-2 py-1 text-center align-middle"
                    style={{
                      minWidth: 110,
                      position: "sticky",
                      right: 0,
                      zIndex: 1,
                      background: "white",
                    }}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row["id"], row)}
                          title="Xem chi tiết / Edit"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row["id"], row)}
                          title="Xóa"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tổng số bản ghi */}
      <div className="text-xs text-gray-600 mt-2">
        Tổng số: <span className="font-bold">{total}</span> bản ghi
      </div>
      {/* Pagination */}
      {onPageChange && onPageSizeChange && (
        <div className="flex items-center justify-between mt-4">
          <div>
            <span>Hiển thị: </span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
          <div>
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1 border rounded mr-2"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1 border rounded ml-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
