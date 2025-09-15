
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { checkToken, login } from "@/services/authService";

export default function LoginForm() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Try to get token from localStorage (or other storage)
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      let isValid = false;
      if (storedToken) {
        isValid = await checkToken(storedToken);
      }
      if (isValid) {
        // Token is valid, skip login
        setError("Already logged in.");
        setLoading(false);
        return;
      }
      // Token invalid or not found, proceed to login
      const res = await login(formData.username, formData.password);
      if (res.token) {
        // Save token to localStorage
        localStorage.setItem("token", res.token);
        // Optionally save other user info
        localStorage.setItem("user_id", res.user_id);
        localStorage.setItem("role", res.role);
        // Redirect or show success
        setError(null);
        // window.location.href = "/profile"; // Example redirect
      } else {
        setError("Login failed: No token returned.");
      }
    } catch (err: any) {
      setError(err?.message || "Login error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EBF8F4] relative">
      
      {/* Login form centered */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-[#C7EDE4] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Login
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D89B76] text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl hover:bg-[#c8885e] transition-colors duration-200 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
            )}
          </form>

          {/* Register Link */}
          <div className="text-center mt-4 sm:mt-6">
            <span className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#e8bc4e] hover:text-[#b5933d] font-medium"
              >
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
