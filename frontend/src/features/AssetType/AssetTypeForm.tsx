import { useState, useEffect } from "react";
import { AssetTypeFormData } from "../../types/AssetType";
import api from "../../api/axios";
import { toast } from 'react-toastify'

interface AssetTypeFormProps {
  item: AssetTypeFormData;
  onClose: () => void;
  onSaved?: () => void;
}

type GroupOption = { id: number; groupName: string };

const AssetTypeForm = ({ item, onClose, onSaved }: AssetTypeFormProps) => {
  const [formData, setFormData] = useState<AssetTypeFormData>(item);
  const [loading, setLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState<string>("");
  const [groups, setGroups] = useState<GroupOption[]>([]);

  // Nếu item thay đổi thì cập nhật lại formData
  useEffect(() => {
    setFormData(item);
    // Gợi ý mã loại
    api.get("/asset-type/suggest-code")
      .then(res => setSuggestedCode(res.data.data || ""))
      .catch(() => setSuggestedCode(""));
    // Lấy danh sách nhóm active
    api.get("/asset-group/active-groups")
      .then(res => setGroups(res.data.data || []))
      .catch(() => setGroups([]));
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "groupId" ? Number(value) : value,
    }));
  };

  const isEdit = !!formData.id;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/asset-type/${formData.id}`, formData);
        // toast.success({ message: res.data.status || "Cập nhật thành công!", type: "success" });
        toast.success(res.data.status || "Cập nhật thành công!");
      } else {
        res = await api.post(`/asset-type`, formData);
        // setToast?.({ message: res.data.status || "Thêm mới thành công!", type: "success" });
        toast.success(res.data.status || "Thêm mới thành công!");
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      // setToast?.({
      //   message: err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin loại tài sản" : "Lỗi khi thêm mới loại tài sản"),
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin loại tài sản" : "Lỗi khi thêm mới loại tài sản"))
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow min-w-[350px] w-full max-w-md"
        onKeyDown={e => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center mb-2">
            {isEdit ? "Sửa thông tin Loại tài sản" : "Thêm mới Loại tài sản"}
          </h2>
        </div>
        {isEdit && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ID</label>
            <input
              type="text"
              name="id"
              value={formData.id ?? ""}
              readOnly
              className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-500"
            />
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã loại tài sản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="typeCode"
              value={formData.typeCode}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {!formData.typeCode && suggestedCode && (
              <div className="text-xs text-gray-400 mt-1">
                Hint: <span className="italic">{suggestedCode}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên loại tài sản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="typeName"
              value={formData.typeName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nhóm tài sản <span className="text-red-500">*</span>
            </label>
            <select
              name="groupId"
              value={formData.groupId ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn nhóm tài sản</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.groupName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hình thức quản lý <span className="text-red-500">*</span>
            </label>
            <select
              name="managementType"
              value={formData.managementType}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Chọn hình thức</option>
              <option value="quantity">Số lượng</option>
              <option value="code">Mã thiết bị</option>
            </select>
          </div>
          <div className="flex gap-3">
            <div className="w-1/3">
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ghi chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 resize-y min-h-[38px]"
                placeholder="Nhập ghi chú"
              />
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
            {loading ? (isEdit ? "Đang lưu..." : "Đang thêm...") : (isEdit ? "Lưu" : "Thêm mới")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetTypeForm;