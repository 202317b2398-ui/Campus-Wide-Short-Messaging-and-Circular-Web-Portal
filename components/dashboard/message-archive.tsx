"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Filter, ChevronRight } from "lucide-react"

interface MessageArchiveProps {
  userRole: "student" | "staff" | "admin" | null
  onSelectMessage: (id: number) => void
}

const mockArchivedMessages = [
  {
    id: 1,
    title: "Campus Closure Notice",
    content: "The campus will be closed on October 31st for maintenance.",
    sender: "College Office",
    timestamp: "2 hours ago",
    date: "October 29, 2024",
    priority: "high",
    category: "Administrative",
    readCount: 1250,
    totalRecipients: 1500,
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    content: "Final exam schedules for Fall 2024 have been released.",
    sender: "Academic Affairs",
    timestamp: "5 hours ago",
    date: "October 29, 2024",
    priority: "medium",
    category: "Academic",
    readCount: 980,
    totalRecipients: 1500,
  },
  {
    id: 3,
    title: "Library Extended Hours",
    content: "The library will remain open until 11 PM during exam week.",
    sender: "Library Services",
    timestamp: "1 day ago",
    date: "October 28, 2024",
    priority: "low",
    category: "Services",
    readCount: 450,
    totalRecipients: 1500,
  },
  {
    id: 4,
    title: "Scholarship Application Deadline",
    content: "Applications for Spring 2025 scholarships close on November 15th.",
    sender: "Financial Aid",
    timestamp: "3 days ago",
    date: "October 26, 2024",
    priority: "high",
    category: "Financial",
    readCount: 1100,
    totalRecipients: 1500,
  },
  {
    id: 5,
    title: "Campus Event: Tech Symposium",
    content: "Join us for our annual technology symposium featuring industry leaders.",
    sender: "Student Affairs",
    timestamp: "1 week ago",
    date: "October 22, 2024",
    priority: "low",
    category: "Events",
    readCount: 650,
    totalRecipients: 1500,
  },
  {
    id: 6,
    title: "Parking Permit Renewal",
    content: "Parking permits for Spring 2025 are now available for renewal.",
    sender: "Campus Services",
    timestamp: "2 weeks ago",
    date: "October 15, 2024",
    priority: "medium",
    category: "Administrative",
    readCount: 800,
    totalRecipients: 1500,
  },
]

export default function MessageArchive({ userRole, onSelectMessage }: MessageArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const categories = ["all", "Administrative", "Academic", "Services", "Financial", "Events"]
  const priorities = ["all", "high", "medium", "low"]

  // Filter and search messages
  const filteredMessages = useMemo(() => {
    let results = mockArchivedMessages

    // Search filter
    if (searchQuery) {
      results = results.filter(
        (msg) =>
          msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      results = results.filter((msg) => msg.category === selectedCategory)
    }

    // Priority filter
    if (selectedPriority !== "all") {
      results = results.filter((msg) => msg.priority === selectedPriority)
    }

    // Sort
    if (sortBy === "recent") {
      results.sort((a, b) => mockArchivedMessages.indexOf(a) - mockArchivedMessages.indexOf(b))
    } else if (sortBy === "oldest") {
      results.sort((a, b) => mockArchivedMessages.indexOf(b) - mockArchivedMessages.indexOf(a))
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      results.sort(
        (a, b) =>
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder],
      )
    }

    return results
  }, [searchQuery, selectedCategory, selectedPriority, sortBy])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Message Archive</h2>
        <p className="text-slate-400">Search and browse all messages and circulars</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={20} />
            <Input
              placeholder="Search messages by title, content, or sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Filter size={16} />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Filter size={16} />
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {pri === "all" ? "All Priorities" : pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar size={16} />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-400">
            Found <span className="font-semibold text-white">{filteredMessages.length}</span> message
            {filteredMessages.length !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              onClick={() => onSelectMessage(message.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-white">{message.title}</CardTitle>
                      <Badge
                        className={`${
                          message.priority === "high"
                            ? "bg-red-900 text-red-200"
                            : message.priority === "medium"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-green-900 text-green-200"
                        }`}
                      >
                        {message.priority}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {message.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      From {message.sender} • {message.date}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {userRole !== "student" && (
                      <div className="text-right text-sm">
                        <p className="text-slate-300 font-medium">{message.readCount}</p>
                        <p className="text-slate-500 text-xs">of {message.totalRecipients}</p>
                      </div>
                    )}
                    <ChevronRight size={20} className="text-slate-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 line-clamp-2">{message.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 mb-2">No messages found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
