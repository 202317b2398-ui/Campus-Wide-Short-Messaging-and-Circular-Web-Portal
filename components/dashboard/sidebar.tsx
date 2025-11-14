"use client"
import { MessageSquare, Send, Settings } from "lucide-react"

interface SidebarProps {
  userRole: "student" | "staff" | "admin" | null
  activeView: "feed" | "create" | "archive" | "admin"
  onViewChange: (view: "feed" | "create" | "archive" | "admin") => void
}

export default function Sidebar({ userRole, activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    {
      id: "feed",
      label: "Message Feed",
      icon: MessageSquare,
      show: true,
    },
    {
      id: "create",
      label: "Create Message",
      icon: Send,
      show: userRole !== "student",
    },
    {
      id: "admin",
      label: "Admin Panel",
      icon: Settings,
      show: userRole === "admin",
    },
  ]

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 h-[calc(100vh-73px)] overflow-y-auto flex flex-col">
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          if (!item.show) return null
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeView === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Role Info */}
      <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <p className="text-xs text-slate-400 font-medium mb-2">👤 Current Role</p>
        <p className="text-sm font-semibold text-blue-400 capitalize">{userRole}</p>
      </div>
    </aside>
  )
}
