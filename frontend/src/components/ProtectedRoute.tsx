import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false); // dùng để tránh render sớm

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    } else if (!allowedRoles.includes(user.role)) {
      toast.warning("Bạn không có quyền truy cập");
    }

    setChecked(true);
  }, [user, allowedRoles, navigate, loading]);

  if (loading || !checked) {
    return <div className="text-center p-4 text-gray-600">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="p-4 text-center text-red-500 text-xl">
        Bạn không có quyền truy cập vào nội dung này.
      </div>
    );
  }

  return <>{children}</>;
}
