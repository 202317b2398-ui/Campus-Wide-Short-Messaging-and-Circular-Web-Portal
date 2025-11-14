"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Send, Calendar, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface CreateMessageProps {
  userRole: "staff" | "admin"
  userName: string
}

export default function CreateMessage({ userRole, userName }: CreateMessageProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState("medium")
  const [recipients, setRecipients] = useState("all")
  const [attachments, setAttachments] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [scheduleType, setScheduleType] = useState("now")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map((f) => f.name)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const { addMessage, messages, groups, users } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newMessage = {
      id: Math.max(...messages.map((m) => m.id), 0) + 1,
      title,
      content,
      priority: priority as "low" | "medium" | "high",
      recipients,
      customGroups: selectedGroupIds.map((groupId) => groups.find((group) => group.id === groupId)?.name || ""),
      attachments,
      scheduleType: scheduleType as "now" | "later",
      scheduleDate,
      scheduleTime,
      sender: userName,
      senderRole: userRole,
      timestamp: new Date().toLocaleString(),
      readCount: 0,
      totalRecipients:
        recipients === "all"
          ? users.length
          : recipients === "students"
            ? users.filter((u) => u.role === "Student").length
            : users.filter((u) => u.role === "Staff").length,
      category: "General",
      acknowledged: false,
    }

    addMessage(newMessage)

    console.log("[v0] Message created and added to store:", newMessage)

    setSuccessMessage(
      scheduleType === "now"
        ? "Message sent successfully!"
        : `Message scheduled for ${scheduleDate} at ${scheduleTime}`,
    )
    setTitle("")
    setContent("")
    setPriority("medium")
    setRecipients("all")
    setAttachments([])
    setSelectedGroupIds([])
    setScheduleType("now")
    setScheduleDate("")
    setScheduleTime("")
    setIsSubmitting(false)

    window.scrollTo({ top: 0, behavior: "smooth" })

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const recipientOptions = [
    { value: "all", label: "All Campus Members", count: users.length },
    { value: "students", label: "Students Only", count: users.filter((u) => u.role === "Student").length },
    { value: "staff", label: "Staff Only", count: users.filter((u) => u.role === "Staff").length },
    ...(userRole === "admin" ? [{ value: "custom", label: "Custom Group", count: 0 }] : []),
  ]

  const selectedRecipientCount = recipientOptions.find((r) => r.value === recipients)?.count || selectedGroupIds.length

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Message</h2>
        <p className="text-slate-400">Send a new message or circular to campus members</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-400 flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-green-400 hover:text-green-300">
            <X size={18} />
          </button>
        </div>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">New Message</CardTitle>
          <CardDescription className="text-slate-400">
            Compose and send a message to selected recipients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Message Title</label>
              <Input
                placeholder="Enter message title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Message Content</label>
              <Textarea
                placeholder="Enter your message content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 min-h-40"
                required
              />
              <p className="text-xs text-slate-500">{content.length} characters</p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-2 px-3 rounded-lg font-medium transition-colors capitalize ${
                      priority === level
                        ? level === "high"
                          ? "bg-red-600 text-white"
                          : level === "medium"
                            ? "bg-yellow-600 text-white"
                            : "bg-green-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Send To</label>
              <select
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
              >
                {recipientOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count} recipients)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Groups (Admin Only) */}
            {userRole === "admin" && recipients === "custom" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Select Groups</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {groups.length === 0 ? (
                    <p className="text-slate-400 text-sm p-3 bg-slate-700/50 rounded">
                      No groups created yet. Create groups in Group Management tab.
                    </p>
                  ) : (
                    groups.map((group) => (
                      <label
                        key={group.id}
                        className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroupIds.includes(group.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGroupIds([...selectedGroupIds, group.id])
                            } else {
                              setSelectedGroupIds(selectedGroupIds.filter((id) => id !== group.id))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-300">{group.name}</span>
                        <span className="text-xs text-slate-500 ml-auto">({group.members.length} members)</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar size={16} />
                Schedule Message
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(["now", "later"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setScheduleType(type)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors capitalize ${
                        scheduleType === type
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {type === "now" ? "Send Now" : "Schedule for Later"}
                    </button>
                  ))}
                </div>

                {scheduleType === "later" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Date</label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required={scheduleType === "later"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Time</label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required={scheduleType === "later"}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Attachments</label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-slate-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload size={24} className="text-slate-400" />
                  <span className="text-sm text-slate-400">Click to upload or drag and drop</span>
                  <span className="text-xs text-slate-500">PDF, DOC, XLS, JPG, PNG up to 10MB</span>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-sm text-slate-300">{file}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Message Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipients:</span>
                  <span className="text-white font-medium">{selectedRecipientCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority:</span>
                  <Badge
                    className={`${
                      priority === "high"
                        ? "bg-red-900 text-red-200"
                        : priority === "medium"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-green-900 text-green-200"
                    }`}
                  >
                    {priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attachments:</span>
                  <span className="text-white font-medium">{attachments.length}</span>
                </div>
                {scheduleType === "later" && (
                  <div className="flex justify-between pt-2 border-t border-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={14} />
                      Scheduled for:
                    </span>
                    <span className="text-white font-medium">
                      {scheduleDate} at {scheduleTime}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={
                isSubmitting || !title || !content || (scheduleType === "later" && (!scheduleDate || !scheduleTime))
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {scheduleType === "now" ? "Sending..." : "Scheduling..."}
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  {scheduleType === "now" ? "Send Message" : "Schedule Message"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
