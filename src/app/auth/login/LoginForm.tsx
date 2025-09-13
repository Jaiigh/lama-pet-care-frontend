"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-[#EBF8F4] relative">
      {/* Logo in top-left corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            alt="LAMA Pet Care Logo"
            width={80}
            height={27}
            className="cursor-pointer sm:w-[100px] sm:h-[34px]"
          />
        </Link>
      </div>

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
            >
              LOGIN
            </button>
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
