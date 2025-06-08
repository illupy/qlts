// import React from "react";
// import { createPortal } from "react-dom";
// export type ToastType = "success" | "error";

// interface ToastProps {
//   message: string;
//   type?: ToastType;
//   onClose: () => void;
//   duration?: number; // ms, chỉ dùng cho success
// }
// const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose, duration = 4000 }) => {
//   React.useEffect(() => {
//     if (type === "success") {
//       const timer = setTimeout(onClose, duration);
//       return () => clearTimeout(timer);
//     }
//   }, [type, duration, onClose]);

//   const toastContent = (
//     <div
//       className={`
//         fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] min-w-[250px] max-w-xs px-4 py-3 rounded shadow-lg
//         flex items-start gap-2
//         ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
//       `}
//       role="alert"
//     >
//       <span className="flex-1">{message}</span>
//       <button
//         onClick={onClose}
//         className="ml-2 text-white font-bold"
//         aria-label="Đóng"
//       >
//         ×
//       </button>
//     </div>
//   );

//   return createPortal(toastContent, document.getElementById("toast-root")!);
// };

// export default Toast;