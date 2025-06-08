//pop up when click on edit 
import { useState, useEffect } from "react";
import { PartnerType } from "../../types/Partner";
import api from "../../api/axios";
import {toast} from 'react-toastify'
interface PartnerFormProps {
  item: PartnerType;
  onClose: () => void;
  onSaved?: () => void;
}

const PartnerForm = ({ item, onClose, onSaved }: PartnerFormProps) => {
  const [formData, setFormData] = useState<PartnerType>(item);
  const [loading, setLoading] = useState(false);

  // Nếu item thay đổi thì cập nhật lại formData
  useEffect(() => {
    setFormData(item);
  }, [item]);

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
        res = await api.put(`/partner/${formData.id}`, formData);
        // setToast?.({ message: res.data.status || "Cập nhật thành công!", type: "success" });
        toast.success(res.data.status || "Cập nhật thành công!")
      } else {
        res = await api.post(`/partner`, formData);
        // setToast?.({ message: res.data.status || "Thêm mới thành công!", type: "success" });
        toast.success(res.data.status || "Thêm mới thành công!")
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      // setToast?.({
      //   message: err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin đối tác" : "Lỗi khi thêm mới đối tác"),
      //   type: "error",
      // });
      toast.error(err.response?.data?.message || (isEdit ? "Lỗi khi lưu thông tin đối tác" : "Lỗi khi thêm mới đối tác"))
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
              Mã đối tác <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên đối tác <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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

export default PartnerForm;
