import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import api from "../api/axios";

// Kiểu dữ liệu người dùng
type User = {
  name: string;
  email: string;
  role: string;
};

// Kiểu dữ liệu của context
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; 
  login: (user: User) => void;
  logout: () => void;
};
// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Thêm loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.user); 
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      } finally {
        setLoading(false); // ✅ Set loading false sau khi xong
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    axios.post("/auth/logout", {}, { withCredentials: true }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
