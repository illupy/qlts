import { useState, useEffect } from "react";
import DataTable, { Column } from "../../components/Table";
import TableHeader from "../../components/TableHeader";
import { AssetFlowType } from "../../types/AssetFlow";
import api from "../../api/axios";
import AssetFlowForm from "./AssetFlowForm";
import { toast } from 'react-toastify'
import ConfirmDialog from "../../components/ConfirmDialog";

const AssetFlow = () => {
  // Định nghĩa cấu hình cột
  const columns: Column<AssetFlowType>[] = [
    {
      key: "flowCode",
      label: "Mã dòng tài sản",
      searchable: true,
      sortable: true,
    },
    {
      key: "flowName",
      label: "Tên dòng tài sản",
      searchable: true,
      sortable: true,
    },
    { key: "status", label: "Trạng thái", searchable: true, sortable: true },
    { key: "note", label: "Ghi chú", searchable: true },
  ];

  // State cho dữ liệu, sắp xếp, tìm kiếm và phân trang
  const [data, setData] = useState<AssetFlowType[]>([]);
  const [total, setTotal] = useState(0);

  const [orderBy, setOrderBy] = useState<keyof AssetFlowType>();
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("DESC");

  // filters đối tượng chứa các trường tìm kiếm
  const [filters, setFilters] = useState<
    Partial<Record<keyof AssetFlowType, string>>
  >({});

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State để lưu thông tin đang chỉnh sửa
  const [editItem, setEditItem] = useState<AssetFlowType | null>(null);
  const [deleteItem, setDeleteItem] = useState<AssetFlowType | null>(null);

  // add item
  const [addItem, setAddItem] = useState<AssetFlowType | null>(null);

  // State cho thông báo
  // const [toast, setToast] = useState<{
  //   message: string;
  //   type: "success" | "error";
  // } | null>(null);

  // Gọi API với payload hiện hành
  const fetchData = async () => {
    const payload = {
      page,
      pageSize,
      searchFlowCode: filters.flowCode || "",
      searchFlowName: filters.flowName || "",
      searchNote: filters.note || "",
      searchStatus: filters.status || "",
      orderBy: orderBy || "",
      orderDirection,
    };

    try {
      const res = await api.post("/asset-flow/paginate", payload);
      // Giả sử API trả về dữ liệu như:
      // { status: "success", data: { assetFlow: { data: [...], total: 100, page: 1, pageSize: 10 } } }
      setData(res.data.assetFlow.data);
      setTotal(res.data.assetFlow.total);
    } catch (error) {
      // setToast({ message: "Lỗi khi tải dữ liệu", type: "error" });
      toast.error("Lỗi khi tải dữ liệu")
    }
  };

  // Gọi API khi các tham số thay đổi
  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, orderBy, orderDirection]);

  // Callback khi thay đổi sắp xếp
  const handleSortChange = (
    newOrderBy: keyof AssetFlowType,
    newOrderDirection: "ASC" | "DESC"
  ) => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
    setPage(1);
  };

  // Callback khi thay đổi tìm kiếm
  const handleFilterChange = (key: keyof AssetFlowType, value: string) => {
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
  const handleEdit = (_id: number, row: AssetFlowType) => {
    setEditItem(row); // Gán thông tin vào state để mở popup
  };

  const handleDelete = (_id: number, row: AssetFlowType) => {
    setDeleteItem(row);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/asset-flow/${deleteItem.id}`);
      // setToast({ message: "Xóa thành công!", type: "success" });
      toast.success("Xóa thành công")
      setDeleteItem(null);
      await fetchData();
    } catch (err: any) {
      // setToast({
      //   message: err.response?.data?.message || "Lỗi khi xóa dòng tài sản",
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || "Lỗi khi xóa dòng tài sản")
    }
  };

  return (
    <>
      <TableHeader
        title="Dòng tài sản"
        onAdd={() =>
          setAddItem({
            flowCode: "",
            flowName: "",
            status: "active",
            note: "",
          })
        }
        // onImport={() => console.log("Import")}
        //onRefresh will clear all filters and oderBy and everything, set to default
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Hiển thị popup khi editItem khác null */}
      {editItem && (
        <AssetFlowForm
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
        <AssetFlowForm
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
          message={`Xóa dòng tài sản "${deleteItem.flowName}"?`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default AssetFlow;
