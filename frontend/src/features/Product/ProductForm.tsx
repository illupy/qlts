import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
export interface ProductFormData {
  id?: number;
  productCode: string;
  productName: string;
  productType: "product" | "service";
  productGroup:
    | "telecommunications"
    | "IT"
    | "RD"
    | "fixedasset"
    | "buildingindorinfras"
    | "other";
  assetTypeId?: number;
  assetFlowId?: number;
  unitId?: number;
  status: "active" | "inactive";
  note?: string;
  partnerIds: number[]; // mảng id đối tác
}

interface ProductFormProps {
  item: ProductFormData;
  onClose: () => void;
  onSaved?: () => void;
}

type Option = { label: string; value: any };

const PRODUCT_TYPE_OPTIONS: Option[] = [
  { label: "Hàng hóa", value: "product" },
  { label: "Dịch vụ", value: "service" },
];

const PRODUCT_GROUP_OPTIONS: Option[] = [
  { label: "Viễn thông", value: "telecommunications" },
  { label: "CNTT", value: "IT" },
  { label: "NCSX", value: "RD" },
  { label: "Mua sắm TSCĐ", value: "fixedasset" },
  { label: "XD tòa nhà/XD CSHT", value: "buildingindorinfras" },
  { label: "Khác", value: "other" },
];

const STATUS_OPTIONS: Option[] = [
  { label: "active", value: "active" },
  { label: "inactive", value: "inactive" },
];

const ProductForm = ({ item, onClose, onSaved }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(item);
  const [loading, setLoading] = useState(false);

  // Dữ liệu select
  const [partnerOptions, setPartnerOptions] = useState<Option[]>([]);
  const [assetTypeOptions, setAssetTypeOptions] = useState<Option[]>([]);
  const [assetFlowOptions, setAssetFlowOptions] = useState<Option[]>([]);
  const [unitOptions, setUnitOptions] = useState<Option[]>([]);
  const [suggestedCode, setSuggestedCode] = useState<string>("");
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [addingUnit, setAddingUnit] = useState(false);
  useEffect(() => {
    setFormData(item);
  }, [item]);

  useEffect(() => {
    api
      .get("/partner/active-partners")
      .then((res) =>
        setPartnerOptions(
          (res.data.data || []).map((p: any) => ({
            label: p.name,
            value: p.id,
          }))
        )
      )
      .catch(() => setPartnerOptions([]));
    api
      .get("/asset-type/active-types")
      .then((res) =>
        setAssetTypeOptions(
          (res.data.data || []).map((t: any) => ({
            label: t.typeName,
            value: t.id,
          }))
        )
      )
      .catch(() => setAssetTypeOptions([]));
    api
      .get("/asset-flow/active-flows")
      .then((res) =>
        setAssetFlowOptions(
          (res.data.data || []).map((f: any) => ({
            label: f.flowName,
            value: f.id,
          }))
        )
      )
      .catch(() => setAssetFlowOptions([]));
    api
      .get("/unit/all")
      .then((res) =>
        setUnitOptions(
          (res.data.data || []).map((u: any) => ({
            label: u.name,
            value: u.id,
          }))
        )
      )
      .catch(() => setUnitOptions([]));
    api
      .get("/product/suggest-code")
      .then((res) => setSuggestedCode(res.data.data || ""))
      .catch(() => setSuggestedCode(""));
  }, []);
  const handleAddUnit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault?.();
    if (!newUnitName.trim()) return;
    setAddingUnit(true);
    try {
      const res = await api.post("/unit", { name: newUnitName.trim() });
      const newUnitId = res.data.data.id;
      // Gọi lại API để lấy danh sách đơn vị tính mới nhất
      const unitsRes = await api.get("/unit/all");
      const newOptions = (unitsRes.data.data || []).map((u: any) => ({
        label: u.name,
        value: u.id,
      }));
      setUnitOptions(newOptions);
      setFormData((prev) => ({ ...prev, unitId: newUnitId }));
      setShowAddUnit(false);
      setNewUnitName("");
      toast.success("Thêm đơn vị tính thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi thêm đơn vị tính");
    } finally {
      setAddingUnit(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "partnerIds"
          ? prev.partnerIds
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // Multi-select cho partners
  const handlePartnerChange = (id: number) => {
    setFormData((prev) => {
      const exists = prev.partnerIds.includes(id);
      return {
        ...prev,
        partnerIds: exists
          ? prev.partnerIds.filter((pid) => pid !== id)
          : [...prev.partnerIds, id],
      };
    });
  };

  const isEdit = !!formData.id;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/product/${formData.id}`, formData);
        // setToast?.({
        //   message: res.data.status || "Cập nhật thành công!",
        //   type: "success",
        // });
        toast.success(res.data.status || "Cập nhật thành công!");
      } else {
        res = await api.post(`/product`, formData);
        // setToast?.({
        //   message: res.data.status || "Thêm mới thành công!",
        //   type: "success",
        // });
        toast.success(res.data.status || "Thêm mới thành công!");
      }
      onSaved?.();
      onClose();
    } catch (err: any) {
      // setToast?.({
      //   message:
      //     err.response?.data?.message ||
      //     (isEdit
      //       ? "Lỗi khi lưu thông tin sản phẩm"
      //       : "Lỗi khi thêm mới sản phẩm"),
      //   type: "error",
      // });
      toast.error(
        err.response?.data?.message ||
          (isEdit
            ? "Lỗi khi lưu thông tin sản phẩm"
            : "Lỗi khi thêm mới sản phẩm")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow w-full max-w-3xl"
        // onSubmit={handleSave}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
      >
        <h2 className="text-lg font-semibold text-center mb-4">
          {isEdit
            ? "Sửa thông tin Hàng hóa/Dịch vụ"
            : "Thêm mới Hàng hóa/Dịch vụ"}
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium mb-1">
              Mã HHDV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {/* Gợi ý nếu chưa nhập gì */}
            {!formData.productCode && suggestedCode && (
              <div className="text-xs text-gray-400 mt-1">
                <span className="italic">Hint: {suggestedCode}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium mb-1">
              Tên HHDV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Loại HHDV <span className="text-red-500">*</span>
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn loại</option>
              {PRODUCT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Nhóm HHDV <span className="text-red-500">*</span>
            </label>
            <select
              name="productGroup"
              value={formData.productGroup}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn nhóm</option>
              {PRODUCT_GROUP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Loại tài sản <span className="text-red-500">*</span>
            </label>
            <select
              name="assetTypeId"
              value={formData.assetTypeId ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn loại tài sản</option>
              {assetTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Dòng tài sản <span className="text-red-500">*</span>
            </label>
            <select
              name="assetFlowId"
              value={formData.assetFlowId ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn dòng tài sản</option>
              {assetFlowOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Đơn vị tính <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                name="unitId"
                value={formData.unitId ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 rounded-ee-none rounded-se-none"
                required
              >
                <option value="">Chọn đơn vị tính</option>
                {unitOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-2 py-1 border rounded hover:bg-gray-200 rounded-ss-none rounded-es-none"
                title="Thêm đơn vị tính"
                onClick={() => setShowAddUnit(true)}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 resize-y min-h-[38px]"
              placeholder="Nhập ghi chú"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              Nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <div className="border rounded px-2 py-1 max-h-32 overflow-y-auto flex flex-wrap gap-4">
              {partnerOptions.length === 0 && (
                <div className="text-xs text-gray-400">Không có dữ liệu</div>
              )}
              {partnerOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm py-1 min-w-[140px]"
                >
                  <input
                    type="checkbox"
                    checked={formData.partnerIds.includes(opt.value)}
                    onChange={() => handlePartnerChange(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Đang lưu..."
                : "Đang thêm..."
              : isEdit
              ? "Lưu"
              : "Thêm mới"}
          </button>
          {showAddUnit && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow min-w-[300px]">
                <h3 className="font-semibold mb-2">Thêm đơn vị tính</h3>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 mb-3"
                  placeholder="Nhập tên đơn vị tính"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddUnit(e as any);
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddUnit(false)}
                    disabled={addingUnit}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleAddUnit}
                    disabled={addingUnit}
                  >
                    {addingUnit ? "Đang thêm..." : "Thêm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
