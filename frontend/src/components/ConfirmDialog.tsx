interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow min-w-[300px]">
      <div className="mb-4">{message}</div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-1 border rounded bg-red-600 text-white hover:bg-red-700"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
