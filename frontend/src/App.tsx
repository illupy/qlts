import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import AssetGroup from "./features/AssetGroup/AssetGroup";
import AssetType from "./features/AssetType/AssetType";
import AssetFlow from "./features/AssetFlow/AssetFlow";
import Partner from "./features/Partner/Partner";
import Product from "./features/Product/Product";
import { ToastContainer } from "react-toastify";
import Dashboard from "./features/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "./constants/Role";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected routes with Main Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.ADMIN, UserRole.BUL, UserRole.USER]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asset-group"
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN]}
              >
                <AssetGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asset-type"
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN]}
              >
                <AssetType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asset-flow"
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN]}
              >
                <AssetFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN]}
              >
                <Partner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.USER, UserRole.STAFF, UserRole.ADMIN]}
              >
                <Product />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
