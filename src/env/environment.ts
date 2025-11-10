export const environment = {
  masterUrl: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api",
  production: process.env.NODE_ENV === "production",
};