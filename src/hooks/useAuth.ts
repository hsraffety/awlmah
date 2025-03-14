import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Mock authentication hook
 * In a real application, this would interact with a proper auth backend
 */
export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is authenticated (from localStorage in this mock implementation)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (token) {
          // In a real app, you would validate the token with your backend
          setUser({
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call an API endpoint to authenticate
      if (email === "admin@example.com" && password === "password") {
        // Mock successful login
        const mockUser: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        };

        // Store authentication token
        localStorage.setItem("adminToken", "mock-auth-token");

        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
