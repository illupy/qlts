//pop up when click on edit 
import { useState, useEffect } from "react";
import { AssetFlowType } from "../../types/AssetFlow";
import api from "../../api/axios";
import { toast } from 'react-toastify'

interface AssetFlowFormProps {
  item: AssetFlowType;
  onClose: () => void;
  onSaved?: () => void;
}

const AssetFlowForm = ({ item, onClose, onSaved }: AssetFlowFormProps) => {
  const [formData, setFormData] = useState<AssetFlowType>(item);
  const [loading, setLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState<string>("");

  // Nếu item thay đổi thì cập nhật lại formData
  useEffect(() => {
    setFormData(item);
  }, [item]);

  // Lấy mã dòng gợi ý khi mở form (dù là edit hay add)
  useEffect(() => {
    api.get("/asset-flow/suggest-code")
      .then(res => setSuggestedCode(res.data.data || ""))
      .catch((err) => {
        console.log(err);
        setSuggestedCode("");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isEdit = !!formData.id;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/asset-flow/${formData.id}`, formData);
        // setToast?.({ message: res.data.status || "Cập nhật thành công!", type: "success" });
        toast.success("Cập nhật thành công!")
      } else {
        res = await api.post(`/asset-flow`, formData);
        // setToast?.({ message: res.data.status || "Thêm mới thành công!", type: "success" });
        toast.success("Thêm mới thành công!")
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      // setToast?.({
      //   message: err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin dòng tài sản" : "Lỗi khi thêm mới dòng tài sản"),
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin dòng tài sản" : "Lỗi khi thêm mới dòng tài sản"))
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow min-w-[350px] w-full max-w-md"
        // Ngăn submit khi nhấn Enter
        onKeyDown={e => {
          // Chỉ chặn Enter nếu không phải textarea
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
            {isEdit ? "Sửa thông tin Nhóm tài sản" : "Thêm mới Nhóm tài sản"}
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
              Mã dòng tài sản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="flowCode"
              value={formData.flowCode}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {/* Gợi ý nếu chưa nhập gì */}
            {!formData.flowCode && suggestedCode && (
              <div className="text-xs text-gray-400 mt-1">
                    <span className="italic">Hint: {suggestedCode}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên dòng tài sản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="flowName"
              value={formData.flowName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />  
          </div>
          {/* Flex row cho trạng thái và ghi chú */}
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

export default AssetFlowForm;
