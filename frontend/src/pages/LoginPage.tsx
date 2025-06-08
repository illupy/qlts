import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../store/AuthContext.tsx";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState(""); 
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    // return true;
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+/.test(form.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError(""); // clear server error on change
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("/auth/login", form, {
        withCredentials: true,
      });
      const user = res.data.data.user; // { name, email, role }
      console.log("Login successful:", user);
      const { id, ...userInfo } = user;
      login(userInfo);
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed.";
      setServerError(message); // <-- set error from server
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={`w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

        {serverError && (
          <p className="text-red-500 text-sm mb-4 text-center">{serverError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#009688] text-white py-2 rounded-md hover:bg-[#00796b] transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
