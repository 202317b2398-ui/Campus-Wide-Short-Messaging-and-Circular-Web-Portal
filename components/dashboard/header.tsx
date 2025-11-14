"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface HeaderProps {
  userName: string
  onLogout: () => void
  onNavigateToMessage?: (messageId: number) => void
}

export default function Header({ userName, onLogout, onNavigateToMessage }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, setTheme } = useTheme()
  const notifications = useAppStore((state) => state.notifications)
  const messages = useAppStore((state) => state.messages)

  const unreadCount = notifications.filter((n) => !n.read).length

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const getMessageIdFromNotification = (notifMessage: string): number | null => {
    const message = messages.find(
      (m) => notifMessage.includes(m.title) || notifMessage.includes(m.content.substring(0, 20)),
    )
    return message?.id || null
  }

  return (
    <header
      className={`${
        theme === "light"
          ? "bg-gradient-to-r from-blue-50 to-white border-b border-blue-200"
          : "bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 border-b border-slate-700 dark:border-slate-800"
      } sticky top-0 z-50 shadow-lg`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              theme === "light" ? "bg-blue-200 text-blue-700" : "bg-blue-600 text-white"
            }`}
            title={userName}
          >
            {userInitials}
          </div>
          <h1 className={`text-xl font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>Campus Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              theme === "light" ? "bg-blue-200 hover:bg-blue-300" : "bg-slate-600 hover:bg-slate-700"
            }`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                theme === "light" ? "translate-x-1" : "translate-x-7"
              }`}
            />
            <span
              className={`absolute text-xs font-bold ${theme === "light" ? "left-1.5 text-blue-700" : "right-1.5 text-yellow-300"}`}
            >
              {theme === "light" ? "L" : "D"}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 transition-colors text-xl hover:scale-110 ${
                theme === "light" ? "text-blue-600 hover:text-blue-700" : "text-slate-400 hover:text-blue-400"
              }`}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse text-xs text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-lg shadow-2xl z-50 ${
                  theme === "light"
                    ? "bg-white border border-blue-200"
                    : "bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700"
                }`}
              >
                <div
                  className={`p-4 border-b ${
                    theme === "light"
                      ? "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                      : "border-slate-600 dark:border-slate-700 bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700"
                  }`}
                >
                  <h3 className={`text-sm font-semibold ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    Notifications ({unreadCount} new)
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const messageId = getMessageIdFromNotification(notif.message)

                      return (
                        <div
                          key={notif.id}
                          className={`p-3 border-b transition-colors cursor-pointer ${
                            theme === "light"
                              ? `border-blue-100 hover:bg-blue-50 ${!notif.read ? "bg-blue-100/50" : ""}`
                              : `border-slate-600 dark:border-slate-700 hover:bg-slate-600/50 dark:hover:bg-slate-700/50 ${!notif.read ? "bg-slate-600/30 dark:bg-slate-700/30" : ""}`
                          }`}
                          onClick={() => {
                            useAppStore.setState((state) => ({
                              notifications: state.notifications.map((n) =>
                                n.id === notif.id ? { ...n, read: true } : n,
                              ),
                            }))

                            if (messageId && onNavigateToMessage) {
                              onNavigateToMessage(messageId)
                              setShowNotifications(false)
                            }
                          }}
                        >
                          <p className={`text-sm ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                            {notif.message}
                          </p>
                          <p className={`text-xs mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>
                            {notif.time}
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <div
                      className={`p-4 text-center text-sm ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}
                    >
                      No notifications
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 border-t text-center ${theme === "light" ? "border-blue-200" : "border-slate-600 dark:border-slate-700"}`}
                >
                  <button
                    className={`text-xs transition-colors ${
                      theme === "light" ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"
                    }`}
                    onClick={() => {
                      useAppStore.setState((state) => ({
                        notifications: state.notifications.map((n) => ({ ...n, read: true })),
                      }))
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex items-center gap-3 pl-4 border-l ${
              theme === "light" ? "border-blue-200" : "border-slate-700 dark:border-slate-800"
            }`}
          >
            <div className="text-right">
              <p className={`text-sm font-medium ${theme === "light" ? "text-slate-900" : "text-white"}`}>{userName}</p>
              <p className={`text-xs ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Online</p>
            </div>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className={`text-sm flex items-center gap-2 ${
                theme === "light" ? "text-red-600 hover:text-red-700" : "text-slate-400 hover:text-red-400"
              }`}
              title="Logout"
            >
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
