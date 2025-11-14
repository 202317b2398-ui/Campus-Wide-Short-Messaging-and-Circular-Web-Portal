"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import MessageFeed from "./message-feed"
import CreateMessage from "./create-message"
import MessageDetail from "./message-detail"
import AdminPanel from "./admin-panel"
import { useAppStore } from "@/lib/store"
import { Menu, X } from "lucide-react"

interface DashboardProps {
  userRole: "student" | "staff" | "admin" | null
  userName: string
  onLogout: () => void
}

export default function Dashboard({ userRole, userName, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<"feed" | "create" | "admin">("feed")
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const loadFromDatabase = useAppStore((state) => state.loadFromDatabase)

  useEffect(() => {
    loadFromDatabase()
  }, [loadFromDatabase])

  const handleNavigateToMessage = (messageId: number) => {
    setActiveView("feed")
    setSelectedMessageId(messageId)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header userName={userName} onLogout={onLogout} onNavigateToMessage={handleNavigateToMessage} />
      <div className="flex relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 fixed md:relative z-30 w-64`}
        >
          <Sidebar
            userRole={userRole}
            activeView={activeView}
            onViewChange={(view) => {
              setActiveView(view)
              setSidebarOpen(false)
            }}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 w-full">
          {activeView === "feed" && selectedMessageId ? (
            <MessageDetail
              messageId={selectedMessageId}
              onBack={() => setSelectedMessageId(null)}
              userRole={userRole}
            />
          ) : activeView === "feed" ? (
            <MessageFeed userRole={userRole} onSelectMessage={setSelectedMessageId} />
          ) : activeView === "create" && userRole !== "student" ? (
            <CreateMessage userRole={userRole} userName={userName} />
          ) : activeView === "admin" && userRole === "admin" ? (
            <AdminPanel />
          ) : null}
        </main>
      </div>
    </div>
  )
}
