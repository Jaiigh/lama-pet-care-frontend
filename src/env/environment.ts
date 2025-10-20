export const environment = {
  masterUrl: process.env.NEXT_PUBLIC_API_BASE || "https://lama-pet-care-backend-dev.onrender.com/api/v1",
  production: process.env.NODE_ENV === "production",
};