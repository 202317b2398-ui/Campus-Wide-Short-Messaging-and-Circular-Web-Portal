"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/auth/login-form"
import Dashboard from "@/components/dashboard/dashboard"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "staff" | "admin" | null>(null)
  const [userName, setUserName] = useState("")
  const { loadFromDatabase } = useAppStore()

  useEffect(() => {
    loadFromDatabase()
  }, [loadFromDatabase])

  const handleLogin = (role: "student" | "staff" | "admin", name: string) => {
    setUserRole(role)
    setUserName(name)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserName("")
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard userRole={userRole} userName={userName} onLogout={handleLogout} />
}
