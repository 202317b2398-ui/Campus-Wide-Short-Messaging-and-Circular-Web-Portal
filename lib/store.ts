import { create } from "zustand"

export interface Message {
  id: number
  title: string
  content: string
  sender: string
  senderRole: string
  timestamp: string
  priority: "low" | "medium" | "high"
  recipients: string
  customGroups: string[]
  readCount: number
  totalRecipients: number
  category: string
  acknowledgedBy: string[] // array of user emails who acknowledged
  attachments: string[]
  scheduleType: "now" | "later"
  scheduleDate?: string
  scheduleTime?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: "Student" | "Staff" | "Admin"
  status: "active" | "inactive"
  age?: number
  bloodGroup?: string
  phoneNumber?: string
  department?: string
  course?: string
  subCourse?: string
  dob?: string
  parentPhoneNumber?: string
  responsibleStaff?: string
  password: string // added password field for authentication
}

export interface Notification {
  id: number
  messageId: number
  message: string
  time: string
  read: boolean
}

export interface Group {
  id: number
  name: string
  members: string[] // array of user emails
  createdDate: string
}

interface AppStore {
  messages: Message[]
  users: User[]
  notifications: Notification[]
  groups: Group[]
  addMessage: (message: Message) => void
  addUser: (user: User) => void
  deleteUser: (userId: number) => void
  updateUser: (userId: number, updates: Partial<User>) => void
  getMessages: () => Message[]
  getUsers: () => User[]
  acknowledgeMessage: (messageId: number) => void
  getNotifications: () => Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (notificationId: number) => void
  loadFromDatabase: () => Promise<void>
  isLoading: boolean
  addGroup: (group: Group) => void
  deleteGroup: (groupId: number) => void
  updateGroup: (groupId: number, updates: Partial<Group>) => void
  getGroupsByMember: (userEmail: string) => Group[]
}

export const useAppStore = create<AppStore>((set, get) => ({
  messages: [],
  users: [
    {
      id: 1,
      name: "Admin",
      email: "admin@college.edu",
      role: "Admin",
      status: "active",
      age: 45,
      bloodGroup: "O+",
      phoneNumber: "+91-9876543210",
      department: "College Office",
      password: "admin123", // added default admin password
    },
    {
      id: 2,
      name: "Student Demo",
      email: "student@college.edu",
      role: "Student",
      status: "active",
      age: 20,
      course: "Computer Science",
      password: "student123",
    },
    {
      id: 3,
      name: "Staff Demo",
      email: "staff@college.edu",
      role: "Staff",
      status: "active",
      age: 35,
      department: "Computer Science",
      password: "staff123",
    },
  ],
  notifications: [],
  groups: [],
  isLoading: false,

  loadFromDatabase: async () => {
    set({ isLoading: true })
    try {
      let messages = get().messages
      let users = get().users // Keep default demo users
      let notifications = get().notifications
      let groups = get().groups

      try {
        const messagesRes = await fetch("/api/messages")
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json()
          messages = messagesData.messages || messages
        }
      } catch (e) {
        console.error("[v0] Failed to load messages:", e)
      }

      try {
        const usersRes = await fetch("/api/users")
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          const dbUsers = usersData.users || []
          const defaultEmails = get().users.map((u) => u.email)
          const newDatabaseUsers = dbUsers.filter((u: User) => !defaultEmails.includes(u.email))
          users = [...get().users, ...newDatabaseUsers]
        }
      } catch (e) {
        console.error("[v0] Failed to load users:", e)
        // Keep default demo users on error
      }

      try {
        const notificationsRes = await fetch("/api/notifications")
        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json()
          notifications = notificationsData.notifications || notifications
        }
      } catch (e) {
        console.error("[v0] Failed to load notifications:", e)
      }

      try {
        const groupsRes = await fetch("/api/groups")
        if (groupsRes.ok) {
          const groupsData = await groupsRes.json()
          groups = groupsData.groups || groups
        }
      } catch (e) {
        console.warn("[v0] Groups table may not exist yet. Please run database migrations.")
        groups = []
      }

      set({
        messages,
        users,
        notifications,
        groups,
      })
    } catch (error) {
      console.error("[v0] Failed to load from database:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  addMessage: (message) =>
    set((state) => {
      // Save to database
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      }).catch(console.error)

      const notification: Notification = {
        id: Math.max(...state.notifications.map((n) => n.id), 0) + 1,
        messageId: message.id,
        message: `New message: ${message.title}`,
        time: "just now",
        read: false,
      }
      return {
        messages: [message, ...state.messages],
        notifications: [notification, ...state.notifications],
      }
    }),

  addUser: (user) =>
    set((state) => {
      // Save to database
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).catch(console.error)

      return {
        users: [...state.users, user],
      }
    }),

  deleteUser: (userId) =>
    set((state) => {
      // Delete from database
      fetch(`/api/users/${userId}`, {
        method: "DELETE",
      }).catch(console.error)

      return {
        users: state.users.filter((u) => u.id !== userId),
      }
    }),

  updateUser: (userId, updates) =>
    set((state) => {
      // Update in database
      fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch(console.error)

      return {
        users: state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
      }
    }),

  getMessages: () => get().messages,
  getUsers: () => get().users,
  acknowledgeMessage: (messageId) =>
    set((state) => {
      const userEmail = localStorage.getItem("userEmail") || "student@college.edu"
      const updatedMessages = state.messages.map((m) => {
        if (m.id === messageId) {
          const acknowledgedBy = m.acknowledgedBy || []
          if (!acknowledgedBy.includes(userEmail)) {
            acknowledgedBy.push(userEmail)
          }
          return { ...m, acknowledgedBy }
        }
        return m
      })

      // Persist to database
      const message = updatedMessages.find((m) => m.id === messageId)
      if (message) {
        fetch(`/api/messages/${messageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ acknowledgedBy: message.acknowledgedBy }),
        }).catch(console.error)
      }

      return { messages: updatedMessages }
    }),
  getNotifications: () => get().notifications,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    })),
  addGroup: (group) =>
    set((state) => {
      fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      }).catch(console.error)

      return {
        groups: [...state.groups, group],
      }
    }),

  deleteGroup: (groupId) =>
    set((state) => {
      fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      }).catch(console.error)

      return {
        groups: state.groups.filter((g) => g.id !== groupId),
      }
    }),

  updateGroup: (groupId, updates) =>
    set((state) => {
      fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch(console.error)

      return {
        groups: state.groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g)),
      }
    }),

  getGroupsByMember: (userEmail) => get().groups.filter((g) => g.members.includes(userEmail)),
}))
