"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://lama-pet-care-backend-dev.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        // Dispatch custom event to notify auth change
        window.dispatchEvent(new CustomEvent("auth-changed"));

        onSuccess();
        onClose();
        // Don't reload immediately, let the auth state update naturally
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError("Login failed: No token returned.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
