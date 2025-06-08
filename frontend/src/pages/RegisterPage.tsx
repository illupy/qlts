import { useState } from "react";
import { RegisterData } from "../types/auth";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterData>({
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!formData.name) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi cũ của trường đang nhập
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Nếu đang nhập confirmPassword thì kiểm tra ngay
    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? "Passwords do not match." : "",
      }));
    }

    // Nếu đang nhập password thì kiểm tra confirmPassword luôn
    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          formData.confirmPassword !== value
            ? "Passwords do not match."
            : "",
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("/auth/register", formData);
      alert("Registration successful. You can now log in.");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create an Account
        </h2>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Full Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#009688] text-white py-2 rounded-lg hover:bg-[#00796b] transition duration-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
