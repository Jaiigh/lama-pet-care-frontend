// src/config/api.ts
// ถ้ามี NEXT_PUBLIC_API_BASE จะใช้; ถ้าไม่มี ให้ fallback เป็น URL backend dev
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "https://lama-pet-care-backend-dev.onrender.com/api/v1")
    .replace(/\/$/, "");
