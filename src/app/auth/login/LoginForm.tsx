"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { checkToken, login } from "@/services/authService";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", // Empty string for proper validation
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Get role from URL query parameter
    const roleFromUrl = searchParams.get("role");
    if (roleFromUrl) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [searchParams]);

  
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => {
    const updated = { ...prev, [name]: value };
    console.log("Updated formData:", updated); // logs the new state immediately
    return updated;
  });
};
// Handle form submission

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {console.log("Handled form submission");
    // Check if there is a stored token
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let isValid = false;
    if (storedToken) {
      isValid = await checkToken(storedToken);
    }

    if (isValid) {
      setError("Already logged in.");
      setLoading(false);
      return;
    }

    // Attempt login
    const res = await login(formData.email, formData.password, formData.role);
    if (res.token) {
      // Save token and user info
      localStorage.setItem("token", res.token);
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("role", res.role);

      console.log("Login successful, saved data:", {
        token: res.token,
        user_id: res.user_id,
        role: res.role
      });

      setError(null);
      window.location.href = "/"; // redirect after login
    } else {
      setError("Login failed: No token returned.");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    setError(err?.message || "Login error");
  } finally {
    setLoading(false);
  }
};
  if (!mounted) return null;

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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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

            {/* Role Field */}
            <div>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-8 sm:pr-10 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base appearance-none bg-no-repeat bg-right bg-[length:16px_16px] sm:bg-[length:20px_20px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 12px center",
                }}
                required
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="owner">PetOwner</option>
                <option value="doctor">Doctor</option>
                <option value="caretaker">Caretaker</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D89B76] text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl hover:bg-[#c8885e] transition-colors duration-200 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {error}
              </div>
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
