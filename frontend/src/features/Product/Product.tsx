import { useState, useEffect } from "react";
import DataTable, { Column } from "../../components/Table";
import TableHeader from "../../components/TableHeader";
import api from "../../api/axios";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";
import ProductForm, { ProductFormData } from "./ProductForm";

// Định nghĩa type cho Product
export type ProductType = {
  id: number;
  productCode: string;
  productName: string;
  productType: string;
  productGroup: string;
  assetTypeId: { id: number; assetType: string };
  assetFlowId: { id: number; assetFlow: string };
  unitId: { id: number; unit: string };
  status: "active" | "inactive";
  note?: string;
  partners: { id: number; code: string; name: string }[];
};

const Product = () => {
  const [partnerOptions, setPartnerOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get("/partner/active-partners");
        setPartnerOptions(
          (res.data.data || []).map((p: any) => ({
            label: p.name,
            value: p.id,
          }))
        );
      } catch {
        setPartnerOptions([]);
      }
    };
    fetchPartners();
  }, []);

  const columns: Column<ProductType>[] = [
    { key: "productCode", label: "Mã HHDV", searchable: true, sortable: true },
    { key: "productName", label: "Tên HHDV", searchable: true, sortable: true },
    {
      key: "productType",
      label: "Loại HHDV",
      searchable: true,
      sortable: true,
    },
    {
      key: "productGroup",
      label: "Nhóm HHDV",
      searchable: true,
      sortable: true,
    },
    {
      key: "assetTypeId",
      label: "Loại tài sản",
      render: (value) => value?.assetType || "",
      searchable: true,
      sortable: true,
    },
    {
      key: "assetFlowId",
      label: "Dòng tài sản",
      render: (value) => value?.assetFlow || "",
      searchable: true,
      sortable: true,
    },
    {
      key: "unitId",
      label: "Đơn vị tính",
      render: (value) => value?.unit || "",
      searchable: true,
      sortable: true,
    },
    {
      key: "partners",
      label: "Nhà cung cấp",
      render: (value) =>
        Array.isArray(value) ? value.map((p: any) => p.name).join("\n") : "",
      searchAndSelect: true,
      multiSelect: true,
      selectOptions: partnerOptions,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value, row) => (
        <div className="relative inline-flex items-center gap-2">
          {/* Input checkbox */}
          <input
            type="checkbox"
            checked={value === "active"}
            onChange={() => handleToggleStatus(row)}
            id={`flexSwitchCheckDefault${row.id}`}
            role="switch"
            className="absolute w-10 h-5 opacity-0 cursor-pointer z-20 peer"
          />

          {/* Div toggle hiển thị */}
          <div className="w-10 h-5 bg-gray-200 rounded-full transition-colors peer-checked:bg-green-500 relative flex-shrink-0">
            <div
              className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                value === "active" ? "translate-x-5" : ""
              }`}
            ></div>
          </div>

          {/* Label cho toggle */}
          <label
            htmlFor={`flexSwitchCheckDefault${row.id}`}
            className="inline-block pl-1 select-none cursor-pointer text-xs"
          >
            {value === "active" ? "Hiệu lực" : "Không hiệu lực"}
          </label>
        </div>
      ),
      searchable: true,
      sortable: true,
    },
    { key: "note", label: "Ghi chú", searchable: true },
  ];

  const [data, setData] = useState<ProductType[]>([]);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState<keyof ProductType>();
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState<
    Partial<Record<keyof ProductType, string>>
  >({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editItem, setEditItem] = useState<ProductFormData | null>(null);
  const [addItem, setAddItem] = useState<ProductFormData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ProductType | null>(null);
  // Fetch data
  const fetchData = async () => {
    const payload = {
      page,
      pageSize,
      searchProductCode: filters.productCode || "",
      searchProductName: filters.productName || "",
      searchProductType: filters.productType || "",
      searchProductGroup: filters.productGroup || "",
      searchAssetType: filters.assetTypeId || "",
      searchAssetFlow: filters.assetFlowId || "",
      searchUnit: filters.unitId || "",
      searchStatus: filters.status || "",
      searchPartner: filters.partners || [],
      searchNote: filters.note || "",
      orderBy: orderBy || "",
      orderDirection,
    };
    try {
      const res = await api.post("/product/paginate", payload);
      setData(res.data.products.data);
      setTotal(res.data.products.total);
    } catch (error: any) {
      // setToast({
      //   message: error.response?.data?.message || "Lỗi khi tải dữ liệu",
      //   type: "error",
      // });
      toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize, filters, orderBy, orderDirection]);

  const handleSortChange = (
    newOrderBy: keyof ProductType,
    newOrderDirection: "ASC" | "DESC"
  ) => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
    setPage(1);
  };

  const handleFilterChange = (key: keyof ProductType, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleEdit = (_id: number, row: ProductType) => {
    // Convert ProductType sang ProductFormData
    const editRow: ProductFormData = {
      id: row.id,
      productCode: row.productCode,
      productName: row.productName,
      productType: row.productType as "product" | "service",
      productGroup: row.productGroup as
        | "telecommunications"
        | "IT"
        | "RD"
        | "fixedasset"
        | "buildingindorinfras"
        | "other",
      assetTypeId: row.assetTypeId?.id ?? undefined,
      assetFlowId: row.assetFlowId?.id ?? undefined,
      unitId: row.unitId?.id ?? undefined,
      status: row.status,
      note: row.note || "",
      partnerIds: Array.isArray(row.partners)
        ? row.partners.map((p) => p.id)
        : [],
    };
    setEditItem(editRow);
  };
  const handleDelete = (_id: number, row: ProductType) => setDeleteItem(row);

  // Toggle status hiệu lực
  const handleToggleStatus = async (row: ProductType) => {
    try {
      const newStatus = row.status === "active" ? "inactive" : "active";
      const editRow: ProductFormData = {
        id: row.id,
        productCode: row.productCode,
        productName: row.productName,
        productType: row.productType as "product" | "service",
        productGroup: row.productGroup as
          | "telecommunications"
          | "IT"
          | "RD"
          | "fixedasset"
          | "buildingindorinfras"
          | "other",
        assetTypeId: row.assetTypeId?.id ?? undefined,
        assetFlowId: row.assetFlowId?.id ?? undefined,
        unitId: row.unitId?.id ?? undefined,
        status: newStatus,
        note: row.note || "",
        partnerIds: Array.isArray(row.partners)
          ? row.partners.map((p) => p.id)
          : [],
      };
      await api.put(`/product/${row.id}`, editRow);
      // setToast({ message: "Cập nhật trạng thái thành công!", type: "success" });
      toast.success("Cập nhật trạng thái thành công!");
      fetchData();
    } catch (err: any) {
      // setToast({
      //   message: err.response?.data?.message || "Lỗi khi cập nhật trạng thái",
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/product/${deleteItem.id}`);
      // setToast({ message: "Xóa thành công!", type: "success" });
      toast.success("Xóa thành công!");
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      // setToast({
      //   message: err.response?.data?.message || "Lỗi khi xóa sản phẩm",
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || "Lỗi khi xóa sản phẩm");
    }
  };

  return (
    <>
      <TableHeader
        title="Hàng hóa/Dịch vụ"
        onAdd={() =>
          setAddItem({
            id: 0,
            productCode: "",
            productName: "",
            productType: "product",
            productGroup: "other",
            assetTypeId: 0,
            assetFlowId: 0,
            unitId: 0,
            status: "active", // Mặc định bật hiệu lực
            note: "",
            partnerIds: [],
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
        <ProductForm
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
        <ProductForm
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
          message={`Xóa hàng hóa/dịch vụ "${deleteItem.productName}"?`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default Product;
