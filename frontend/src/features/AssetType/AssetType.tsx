import { useState, useEffect } from "react";
import DataTable, { Column } from "../../components/Table";
import TableHeader from "../../components/TableHeader";
import { AssetTypeType, AssetTypeFormData } from "../../types/AssetType";
import api from "../../api/axios";
import { toast } from 'react-toastify'
import ConfirmDialog from "../../components/ConfirmDialog";
import AssetTypeForm from "./AssetTypeForm";

const AssetType = () => {
  const columns: Column<AssetTypeType>[] = [
    { key: "typeCode", label: "Mã loại tài sản", searchable: true, sortable: true },
    { key: "typeName", label: "Tên loại tài sản", searchable: true, sortable: true },
    { key: "groupName", label: "Nhóm tài sản", searchable: true, sortable: true },
    { key: "managementType", label: "Quản lý theo", searchable: true, sortable: true },
    { key: "status", label: "Trạng thái", searchable: true, sortable: true },
    { key: "note", label: "Ghi chú", searchable: true },
  ];

  // State
  const [data, setData] = useState<AssetTypeType[]>([]);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState<keyof AssetTypeType>();
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState<Partial<Record<keyof AssetTypeType, string>>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editItem, setEditItem] = useState<AssetTypeFormData | null>(null);
  const [addItem, setAddItem] = useState<AssetTypeFormData | null>(null);
  const [deleteItem, setDeleteItem] = useState<AssetTypeType | null>(null);

  // Fetch data
  const fetchData = async () => {
    const payload = {
      page,
      pageSize,
      searchTypeCode: filters.typeCode || "",
      searchTypeName: filters.typeName || "",
      searchGroupName: filters.groupName || "",
      searchManagementType: filters.managementType || "",
      searchStatus: filters.status || "",
      searchNote: filters.note || "",
      orderBy: orderBy || "",
      orderDirection,
    };
    try {
      const res = await api.post("/asset-type/paginate", payload);
      setData(res.data.assetTypes.data);
      setTotal(res.data.assetTypes.total);
    } catch (error: any) {
      // setToast({ message: error.response?.data?.message || "Lỗi khi tải dữ liệu", type: "error" });
      toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu")
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, orderBy, orderDirection]);

  // Các callback
  const handleSortChange = (newOrderBy: keyof AssetTypeType, newOrderDirection: "ASC" | "DESC") => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
    setPage(1);
  };

  const handleFilterChange = (key: keyof AssetTypeType, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Khi edit, cần truyền groupId cho form. Nếu API paginate trả về groupId thì dùng luôn, nếu không thì cần map lại từ groupName sang groupId (dựa vào danh sách nhóm).
  const handleEdit = (_id: number, row: AssetTypeType) => {
    // Nếu API paginate trả về groupId thì dùng row.groupId, nếu không thì cần map lại từ groupName sang groupId (bạn có thể truyền thêm groupId từ backend để đơn giản)
    setEditItem({
      id: row.id,
      typeCode: row.typeCode,
      typeName: row.typeName,
      groupId: row.groupId || 0, // Giả sử row.groupId có thể là 0 nếu không có
      managementType: row.managementType,
      status: row.status,
      note: row.note,
    });
  };

  const handleDelete = (_id: number, row: AssetTypeType) => setDeleteItem(row);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/asset-type/${deleteItem.id}`);
      // setToast({ message: "Xóa thành công!", type: "success" });
      toast.success("Xóa thành công!")
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      // setToast({
      //   message: err.response?.data?.message || "Lỗi khi xóa loại tài sản",
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || "Lỗi khi xóa loại tài sản")
    }
  };

  return (
    <>
      <TableHeader
        title="Loại tài sản"
        onAdd={() =>
          setAddItem({
            typeCode: "",
            typeName: "",
            groupId: 0,
            managementType: "quantity",
            status: "active",
            note: "",
          })
        }
        // onImport={() => console.log("Import")}
        onRefresh={() => {
          setFilters({});
          setOrderBy(undefined);
          setOrderDirection("DESC");
          setPage(1);
          setPageSize(10);
        }}
        // onExport={() => console.log("Export")}
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
        onEdit={(_id, row) => handleEdit(_id, row)}
        onDelete={handleDelete}
      />
      {editItem && (
        <AssetTypeForm
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={() => {
            setEditItem(null);
            fetchData();
          }}
          // setToast={setToast}
        />
      )}
      {addItem && (
        <AssetTypeForm
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
          message={`Xóa loại tài sản "${deleteItem.typeName}"?`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default AssetType;