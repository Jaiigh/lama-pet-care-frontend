"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const fallbackToken = localStorage.getItem("token");
        const currentToken = accessToken || fallbackToken;
        
        setToken(currentToken);
        setIsAuthed(!!currentToken);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when login in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  return { token, isAuthed };
}
