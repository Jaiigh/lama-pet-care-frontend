"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    birthDate: "",
    telephone: "",
    address: "",
    role: "", // Empty string for proper validation
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get today's date for birthDate max attribute
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      const newErrors: Record<string, string> = {};

      if (!formData.role) {
        newErrors.role = "Please select a role";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      console.log("Register submitted:", formData);
      // Handle registration logic here

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Register form centered */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 py-16 sm:py-8">
        <div className="bg-[#C7EDE4] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Register
          </h1>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
                required
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                minLength={8}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                required
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Birth Date Field */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                max={today}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.birthDate ? "true" : "false"}
                aria-describedby={
                  errors.birthDate ? "birthDate-error" : undefined
                }
                required
              />
              {errors.birthDate && (
                <p id="birthDate-error" className="mt-1 text-xs text-red-600">
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Telephone Field */}
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telephone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                placeholder="Enter your phone number"
                value={formData.telephone}
                onChange={handleInputChange}
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]{9,12}"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.telephone ? "true" : "false"}
                aria-describedby={
                  errors.telephone ? "telephone-error" : undefined
                }
                required
              />
              {errors.telephone && (
                <p id="telephone-error" className="mt-1 text-xs text-red-600">
                  {errors.telephone}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
                autoComplete="street-address"
                rows={3}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base resize-none"
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
                required
              />
              {errors.address && (
                <p id="address-error" className="mt-1 text-xs text-red-600">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#E8F6F4] rounded-lg border-0 focus:ring-0 focus:border-2 focus:border-[#76D8B1] focus-visible:ring-1 focus-visible:ring-[#76D8B1] outline-none transition-all duration-200 text-sm sm:text-base"
                aria-invalid={errors.role ? "true" : "false"}
                aria-describedby={errors.role ? "role-error" : undefined}
                required
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="PetOwner">PetOwner</option>
                <option value="Doctor">Doctor</option>
                <option value="Caretaker">Caretaker</option>
              </select>
              {errors.role && (
                <p id="role-error" className="mt-1 text-xs text-red-600">
                  {errors.role}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#D89B76] text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl hover:bg-[#c8885e] transition-colors duration-200 mt-4 sm:mt-6 text-sm sm:text-base ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4 sm:mt-6">
            <span className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#e8bc4e] hover:text-[#b5933d] font-medium"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
