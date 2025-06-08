import { UserRole } from "../constants/Role";
import { useAuth } from "../store/AuthContext";

export type PermissionFlags = {
  canRead: boolean;
  canCUD: boolean;
};

export function usePermissions(): PermissionFlags {
  const { user } = useAuth();
  const role = user?.role || "guest";

  const isAdmin = role === UserRole.ADMIN;
  const isStaff = role === UserRole.STAFF;
  const isUser = role === UserRole.USER;
  return {
    canRead: isAdmin || isStaff || isUser,
    canCUD: isAdmin || isStaff,
  };
}
