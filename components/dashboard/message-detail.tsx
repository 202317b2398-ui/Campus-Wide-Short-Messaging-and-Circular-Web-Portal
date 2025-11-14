"use client"

import React from "react"
import { CheckCircle2, Eye, AlertCircle, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

const MessageDetail = ({ messageId, userRole, onBack }) => {
  const [showAcknowledgmentList, setShowAcknowledgmentList] = React.useState(false)
  const messages = useAppStore((state) => state.messages)
  const acknowledgeMessage = useAppStore((state) => state.acknowledgeMessage)

  const message = messages.find((m) => m.id === messageId)

  if (!message) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4 hover:underline"
        >
          ⬅️ <span>Back to Feed</span>
        </button>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">Message not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const acknowledgedCount = (message.acknowledgedBy && message.acknowledgedBy.length) || 0
  const pendingCount = Math.max(0, message.totalRecipients - message.readCount)
  const unreadCount = Math.max(0, message.totalRecipients - message.readCount)

  const trackingStats = [
    { label: "Read", value: Math.max(0, message.readCount || 0), color: "text-green-400", bgColor: "bg-green-900/20" },
    {
      label: "Unread",
      value: Math.max(0, unreadCount || 0),
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
    },
    {
      label: "Acknowledged",
      value: Math.max(0, acknowledgedCount || 0),
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      label: "Pending",
      value: Math.max(0, pendingCount || 0),
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4 hover:underline"
      >
        ⬅️ <span>Back to Feed</span>
      </button>

      {/* Main Message Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📄</span>
                <CardTitle className="text-2xl text-white">{message.title}</CardTitle>
                <Badge
                  className={`${
                    message.priority === "high"
                      ? "bg-red-900 text-red-200"
                      : message.priority === "medium"
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-green-900 text-green-200"
                  }`}
                >
                  {message.priority === "high" && "🔴"}
                  {message.priority === "medium" && "🟡"}
                  {message.priority === "low" && "🟢"}
                </Badge>
              </div>
              <CardDescription className="text-slate-400">👤 From {message.sender}</CardDescription>
            </div>
            {userRole === "student" && (
              <div className="flex items-center gap-2">
                {message.acknowledgedBy &&
                message.acknowledgedBy.includes(localStorage.getItem("userEmail") || "student@college.edu") ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <span className="text-2xl">✅</span>
                    <span className="text-sm font-medium">Acknowledged</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span className="text-2xl">⏳</span>
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">📤 Sent</p>
              <p className="text-sm text-slate-300">{message.timestamp}</p>
            </div>
            {message.acknowledgedBy && message.acknowledgedBy.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">✅ Acknowledged</p>
                <p className="text-sm text-slate-300">{message.acknowledgedBy.length} users</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message Content */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📝 Message</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                📎 Attachments ({message.attachments.length})
              </h3>
              <div className="space-y-2">
                {message.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <span className="text-sm text-slate-300">📥 {attachment}</span>
                    <Button
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = URL.createObjectURL(new Blob(["attachment content"]))
                        link.download = attachment
                        link.click()
                        console.log("[v0] Downloaded attachment:", attachment)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 transition-colors"
                    >
                      ⬇️
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read Statistics (for staff/admin) */}
          {userRole !== "student" && (
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Read Statistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Recipients</span>
                  <span className="text-lg font-semibold text-white">{Math.max(0, message.totalRecipients || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Read</span>
                  <span className="text-lg font-semibold text-green-400">{Math.max(0, message.readCount || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-lg font-semibold text-yellow-400">
                    {Math.max(0, (message.totalRecipients || 0) - (message.readCount || 0))}
                  </span>
                </div>
                <div className="mt-3 w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width:
                        message.totalRecipients > 0
                          ? `${((message.readCount || 0) / message.totalRecipients) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 text-right">
                  {message.totalRecipients > 0
                    ? Math.round(((message.readCount || 0) / message.totalRecipients) * 100)
                    : 0}
                  % read
                </p>
              </div>
            </div>
          )}

          {/* Tracking Statistics (for staff/admin) */}
          {userRole !== "student" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300">Message Tracking</h3>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Live Updates
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {trackingStats.map((stat) => (
                  <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4 border border-slate-600`}>
                    <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{Math.max(0, stat.value || 0)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {message.totalRecipients > 0
                        ? Math.round(((stat.value || 0) / message.totalRecipients) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                ))}
              </div>

              {/* Read Progress */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Read Progress</span>
                  <span className="text-sm font-semibold text-green-400">
                    {message.totalRecipients > 0
                      ? Math.round(((message.readCount || 0) / message.totalRecipients) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                    style={{
                      width:
                        message.totalRecipients > 0
                          ? `${((message.readCount || 0) / message.totalRecipients) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Acknowledgment Progress */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Acknowledgment Progress</span>
                  <span className="text-sm font-semibold text-blue-400">
                    {message.totalRecipients > 0
                      ? Math.round(((acknowledgedCount || 0) / message.totalRecipients) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{
                      width:
                        message.totalRecipients > 0
                          ? `${((acknowledgedCount || 0) / message.totalRecipients) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Tracking Details Button */}
              <Button
                onClick={() => setShowAcknowledgmentList(!showAcknowledgmentList)}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Users size={18} className="mr-2" />
                {showAcknowledgmentList ? "Hide" : "View"} Recipient Details
              </Button>

              {/* Recipient Details List */}
              {showAcknowledgmentList && (
                <div className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {message.recipients === "all" || message.recipients === "students" || message.recipients === "staff"
                      ? // For standard groups, show sample recipients
                        [
                          { name: "John Smith", status: "acknowledged" as const, time: "2:45 PM" },
                          { name: "Sarah Johnson", status: "read" as const, time: "2:50 PM" },
                          { name: "Mike Davis", status: "read" as const, time: "3:15 PM" },
                          { name: "Emma Wilson", status: "acknowledged" as const, time: "3:20 PM" },
                          { name: "Alex Brown", status: "unread" as const, time: "-" },
                          { name: "Lisa Anderson", status: "unread" as const, time: "-" },
                        ]
                      : // For custom groups, show group members
                        message.customGroups
                          .map((group, idx) => ({
                            name: `${group} Member ${idx + 1}`,
                            status: idx % 3 === 0 ? "acknowledged" : idx % 2 === 0 ? "read" : "unread",
                            time: idx % 3 === 0 ? "3:45 PM" : idx % 2 === 0 ? "4:00 PM" : "-",
                          }))
                          ?.map((recipient, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 border-b border-slate-600 last:border-b-0 hover:bg-slate-600/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold text-slate-300">
                                  {recipient.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-300">{recipient.name}</p>
                                  <p className="text-xs text-slate-500">{recipient.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {recipient.status === "acknowledged" && (
                                  <Badge className="bg-green-900 text-green-200 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    Acknowledged
                                  </Badge>
                                )}
                                {recipient.status === "read" && (
                                  <Badge className="bg-blue-900 text-blue-200 flex items-center gap-1">
                                    <Eye size={14} />
                                    Read
                                  </Badge>
                                )}
                                {recipient.status === "unread" && (
                                  <Badge className="bg-slate-700 text-slate-300 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    Unread
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            {userRole === "student" &&
              !(
                message.acknowledgedBy &&
                message.acknowledgedBy.includes(localStorage.getItem("userEmail") || "student@college.edu")
              ) && (
                <Button
                  onClick={() => {
                    const userEmail = localStorage.getItem("userEmail") || "student@college.edu"
                    acknowledgeMessage(message.id)
                    console.log("[v0] Message acknowledged by:", userEmail)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium transition-all"
                >
                  ✅ Acknowledge Message
                </Button>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessageDetail
