"use client";

import { useState, useEffect } from "react";
import LeadsList from "@/components/admin/LeadsList";
import { useRouter } from "next/navigation";

// Mock authentication
const checkAuth = () => {
  // In a real application, this would verify the session/token
  // For now, we'll just check if a mock token exists in localStorage
  return (
    typeof window !== "undefined" &&
    localStorage.getItem("adminToken") === "mock-auth-token"
  );
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple mock authentication (for demo purposes)
    if (username === "admin" && password === "password") {
      localStorage.setItem("adminToken", "mock-auth-token");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError(
        "Invalid credentials. Hint: username 'admin', password 'password'",
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex bg-[#f3f9d2]">
        <div className="w-60 bg-[#f3f9d2] min-h-screen p-4">
          <div className="text-2xl font-bold mb-8">almă</div>

          <div className="space-y-2">
            <div className="font-medium">Leads</div>
            <div className="font-medium text-gray-600">Settings</div>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center space-x-2 mt-auto">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-bold">A</span>
              </div>
              <div>
                <div className="font-medium">Admin</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Leads</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>

          <LeadsList />
        </div>
      </div>
    </div>
  );
}
