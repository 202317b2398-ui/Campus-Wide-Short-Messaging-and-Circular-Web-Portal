"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

interface LoginFormProps {
  onLogin: (role: "student" | "staff" | "admin", name: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "staff" | "admin">("admin");
  const [error, setError] = useState("");
  const { users } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch by rendering only after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please fill in all fields");
    if (!email.includes("@")) return setError("Please enter a valid email address");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    const user = users.find((u) => u.email === email);
    if (!user) return setError("User not found. Please contact admin to create your account.");
    if (user.password !== password) return setError("Invalid password. Please try again.");

    const userName = email.split("@")[0];
    onLogin(user.role.toLowerCase() as "student" | "staff" | "admin", userName);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 via-white to-blue-50"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      } flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className={`text-3xl font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>
              Campus Portal
            </h1>
          </div>
          <p className={theme === "light" ? "text-slate-600 text-sm" : "text-slate-400 text-sm"}>
            Unified Messaging System
          </p>
        </div>

        <Card className={theme === "light" ? "bg-white border-blue-200" : "bg-slate-800 border-slate-700"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={theme === "light" ? "text-slate-900" : "text-white"}>Sign In</CardTitle>
                <CardDescription className={theme === "light" ? "text-slate-600" : "text-slate-400"}>
                  Access your portal
                </CardDescription>
              </div>

              {/* Theme Toggle */}
              <div className="flex gap-1 bg-gray-200 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    theme === "light"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    theme === "dark"
                      ? "bg-slate-700 text-yellow-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className={`text-sm font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "staff", "student"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-2 rounded-lg transition-all text-center text-xs ${
                        selectedRole === role
                          ? "bg-blue-600 border-2 border-blue-500 shadow-lg shadow-blue-900/50"
                          : theme === "light"
                          ? "bg-blue-50 border-2 border-blue-200 hover:border-blue-300"
                          : "bg-slate-700 border-2 border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <p
                        className={`font-semibold capitalize ${
                          selectedRole === role
                            ? "text-white"
                            : theme === "light"
                            ? "text-slate-700"
                            : "text-slate-300"
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className={`text-sm font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    theme === "light"
                      ? "bg-blue-50 border-blue-200 text-slate-900 placeholder:text-slate-500"
                      : "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  }
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className={`text-sm font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    theme === "light"
                      ? "bg-blue-50 border-blue-200 text-slate-900 placeholder:text-slate-500"
                      : "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  }
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    theme === "light"
                      ? "bg-red-50 border border-red-300 text-red-700"
                      : "bg-red-900/20 border border-red-700 text-red-400"
                  }`}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all hover:shadow-lg"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
