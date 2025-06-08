import { useState, useEffect } from "react";
import DataTable, { Column } from "../../components/Table";
import TableHeader from "../../components/TableHeader";
import { AssetGroupType } from "../../types/AssetGroup";
import api from "../../api/axios";
import AssetGroupForm from "./AssetGroupForm";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";

const AssetGroup = () => {
  // Định nghĩa cấu hình cột
  const columns: Column<AssetGroupType>[] = [
    {
      key: "groupCode",
      label: "Mã nhóm tài sản",
      searchable: true,
      sortable: true,
    },
    {
      key: "groupName",
      label: "Tên nhóm tài sản",
      searchable: true,
      sortable: true,
    },
    { key: "status", label: "Trạng thái", searchable: true, sortable: true },
    { key: "note", label: "Ghi chú", searchable: true },
  ];

  // State cho dữ liệu, sắp xếp, tìm kiếm và phân trang
  const [data, setData] = useState<AssetGroupType[]>([]);
  const [total, setTotal] = useState(0);

  const [orderBy, setOrderBy] = useState<keyof AssetGroupType>();
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("DESC");

  // filters đối tượng chứa các trường tìm kiếm
  const [filters, setFilters] = useState<
    Partial<Record<keyof AssetGroupType, string>>
  >({});

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State để lưu thông tin đang chỉnh sửa
  const [editItem, setEditItem] = useState<AssetGroupType | null>(null);
  const [deleteItem, setDeleteItem] = useState<AssetGroupType | null>(null);

  // add item
  const [addItem, setAddItem] = useState<AssetGroupType | null>(null);

  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<null | {
    imported: number;
    errors: { row: number; message: string }[];
  }>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  // Gọi API với payload hiện hành
  const fetchData = async () => {
    const payload = {
      page,
      pageSize,
      searchGroupCode: filters.groupCode || "",
      searchGroupName: filters.groupName || "",
      searchNote: filters.note || "",
      searchStatus: filters.status || "",
      orderBy: orderBy || "",
      orderDirection,
    };

    try {
      const res = await api.post("/asset-group/paginate", payload);
      // Giả sử API trả về dữ liệu như:
      // { status: "success", data: { assetGroup: { data: [...], total: 100, page: 1, pageSize: 10 } } }
      setData(res.data.assetGroup.data);
      setTotal(res.data.assetGroup.total);
    } catch (error) {
      // setToast({ message: "Lỗi khi tải dữ liệu", type: "error" });
      toast.error("Lỗi khi tải dữ liệu");
    }
  };

  // Gọi API khi các tham số thay đổi
  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, orderBy, orderDirection]);

  // Callback khi thay đổi sắp xếp
  const handleSortChange = (
    newOrderBy: keyof AssetGroupType,
    newOrderDirection: "ASC" | "DESC"
  ) => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
    setPage(1);
  };

  // Callback khi thay đổi tìm kiếm
  const handleFilterChange = (key: keyof AssetGroupType, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  // Callback phân trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Callback action (Edit - Delete)
  const handleEdit = (_id: number, row: AssetGroupType) => {
    setEditItem(row); // Gán thông tin vào state để mở popup
  };
  const handleImport = () => setShowImport(true);

  const handleImportSubmit = async () => {
    if (!importFile) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", importFile);
    try {
      const res = await api.post("/asset-group/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult({
        imported: res.data.imported,
        errors: res.data.errors || [],
      });
      setShowImport(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi import file");
    } finally {
      setImporting(false);
      setImportFile(null);
    }
  };
  const handleExport = async () => {
    try {
      const res = await api.get("/asset-group/export-groups", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AssetGroups.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Xuất file thành công!");
    } catch (err: any) {
      toast.error("Lỗi khi xuất file");
    }
  };
  const handleDelete = (_id: number, row: AssetGroupType) => {
    setDeleteItem(row);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/asset-group/${deleteItem.id}`);
      // setToast({ message: "Xóa thành công!", type: "success" });
      toast.success("Xóa thành công!");
      setDeleteItem(null);
      await fetchData();
    } catch (err: any) {
      // setToast({
      //   message: err.response?.data?.message || "Lỗi khi xóa nhóm tài sản",
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || "Lỗi khi xóa nhóm tài sản");
    }
  };

  return (
    <>
      <TableHeader
        title="Nhóm tài sản"
        onAdd={() =>
          setAddItem({
            groupCode: "",
            groupName: "",
            status: "active",
            note: "",
          })
        }
        onImport={handleImport}
        //onRefresh will clear all filters and oderBy and everything, set to default
        onRefresh={() => {
          setFilters({});
          setOrderBy(undefined);
          setOrderDirection("DESC");
          setPage(1);
          setPageSize(10);
        }}
        onExport={handleExport}
      />
      <DataTable
        columns={columns}
        data={data}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onSortChange={handleSortChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Hiển thị popup khi editItem khác null */}
      {editItem && (
        <AssetGroupForm
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={() => {
            setEditItem(null);
            fetchData();
          }}
          // setToast={setToast} // truyền xuống
        />
      )}
      {addItem && (
        <AssetGroupForm
          item={addItem}
          onClose={() => setAddItem(null)}
          onSaved={() => {
            setAddItem(null);
            fetchData();
          }}
          // setToast={setToast}
        />
      )}
      {deleteItem && (
        <ConfirmDialog
          message={`Xóa nhóm tài sản "${deleteItem.groupName}"?`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {/* Popup chọn file import */}
      {showImport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow min-w-[320px]">
            <h3 className="font-semibold mb-3">Import nhóm tài sản từ Excel</h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setShowImport(false);
                  setImportFile(null);
                }}
                disabled={importing}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleImportSubmit}
                disabled={!importFile || importing}
              >
                {importing ? "Đang import..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup kết quả import */}
      {importResult && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow min-w-[350px] max-w-[90vw]">
            <h3 className="font-semibold mb-2 text-green-700">
              Trạng thái import
            </h3>
            <div className="mb-2">
              Số dòng import thành công: <b>{importResult.imported}</b>
            </div>
            {importResult.errors.length > 0 && (
              <div className="mb-2">
                <div className="font-semibold text-red-600 mb-1">Lỗi:</div>
                <ul className="list-disc pl-5 text-sm max-h-40 overflow-auto">
                  {importResult.errors.map((err, idx) => (
                    <li key={idx}>
                      Dòng {err.row}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setImportResult(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetGroup;
