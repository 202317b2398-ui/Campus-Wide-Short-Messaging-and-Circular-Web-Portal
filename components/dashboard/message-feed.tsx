"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

interface MessageFeedProps {
  userRole: "student" | "staff" | "admin" | null
  onSelectMessage: (id: number) => void
}

export default function MessageFeed({ userRole, onSelectMessage }: MessageFeedProps) {
  const { messages } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📩 Message Feed</h2>
        <p className="text-slate-400">✨ Latest messages and circulars from your college</p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-400">📭 No messages yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card
              key={message.id}
              className="bg-gradient-to-r from-slate-800 to-slate-750 border-slate-700 hover:border-blue-600 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-900/20"
              onClick={() => onSelectMessage(message.id)}
            >
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xl">📌</span>
                      <CardTitle className="text-white break-words">{message.title}</CardTitle>
                      <Badge
                        className={`flex-shrink-0 text-xs ${
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
                        {" " + message.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400 text-sm">
                      👤 From {message.sender} • ⏰ {message.timestamp}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                    {userRole === "student" && (
                      <div className="flex items-center gap-2">
                        {message.acknowledged ? (
                          <div className="flex flex-col items-center">
                            <span className="text-2xl">✅</span>
                            <span className="text-xs text-green-500 mt-1">Acknowledged</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-2xl">⏳</span>
                            <span className="text-xs text-yellow-500 mt-1">Pending</span>
                          </div>
                        )}
                      </div>
                    )}
                    {userRole !== "student" && (
                      <div className="text-right text-sm">
                        <p className="text-slate-300 font-medium">👁️ {message.readCount}</p>
                        <p className="text-slate-500 text-xs">of {message.totalRecipients}</p>
                      </div>
                    )}
                    <span className="text-xl hidden md:block">→</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-3">
                <p className="text-slate-300 line-clamp-2 text-sm md:text-base">{message.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
