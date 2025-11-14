"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Plus, Search, CheckCircle2 } from "lucide-react"
import CreateStudentUser, { type StudentData as StudentDataType } from "./create-student-user"
import CreateStaffUser, { type StaffData as StaffDataType } from "./create-staff-user"
import EditUser from "./edit-user"
import { useAppStore } from "@/lib/store"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "groups" | "settings">("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  const [showCreateStaff, setShowCreateStaff] = useState(false)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<(typeof users)[0]> | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([])

  const { users, groups, messages, addUser, deleteUser, updateUser, addGroup, deleteGroup, updateGroup } = useAppStore()

  const handleCreateStudent = (data: StudentDataType) => {
    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      name: data.name,
      email: data.email,
      role: "Student" as const,
      status: "active" as const,
      age: data.age,
      bloodGroup: data.bloodGroup,
      phoneNumber: data.phoneNumber,
      department: data.department,
      course: data.course,
      subCourse: data.subCourse,
      dob: data.dob,
      parentPhoneNumber: data.parentPhoneNumber,
      responsibleStaff: data.responsibleStaff,
    }
    addUser(newUser)
    console.log("[v0] Student created:", data)
  }

  const handleCreateStaff = (data: StaffDataType) => {
    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      name: data.name,
      email: data.email,
      role: "Staff" as const,
      status: "active" as const,
      age: data.age,
      bloodGroup: data.bloodGroup,
      phoneNumber: data.phoneNumber,
      department: data.department,
    }
    addUser(newUser)
    console.log("[v0] Staff created:", data)
  }

  const handleDeleteUser = (userId: number) => {
    setDeleteConfirm(userId)
  }

  const confirmDelete = (userId: number) => {
    deleteUser(userId)
    setDeleteConfirm(null)
    console.log("[v0] User deleted:", userId)
  }

  const handleEditUser = (userId: number) => {
    setEditingUser(editingUser === userId ? null : userId)
  }

  const handleSaveEdit = (userId: number) => {
    if (editFormData) {
      updateUser(userId, editFormData)
      setEditingUser(null)
      setEditFormData(null)
      console.log("[v0] User updated:", userId, editFormData)
    }
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Math.max(...groups.map((g) => g.id), 0) + 1,
        name: newGroupName,
        members: newGroupMembers,
        createdDate: new Date().toLocaleDateString(),
      }
      addGroup(newGroup)
      setNewGroupName("")
      setNewGroupMembers([])
      setShowCreateGroup(false)
      console.log("[v0] Group created:", newGroup)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Admin Panel</h2>
        <p className="text-slate-400">🛠️ Manage users, groups, and system settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(() => {
          const totalMessages = messages.length
          const totalReadCount = messages.reduce((sum, m) => sum + m.readCount, 0)
          const totalRecipients = messages.reduce((sum, m) => sum + m.totalRecipients, 0)
          const avgReadRate = totalRecipients > 0 ? Math.round((totalReadCount / totalRecipients) * 100) : 0
          const pendingAcks = messages.filter((m) => !m.acknowledged).length

          return [
            { label: "Total Users", value: users.length.toString(), icon: "👥", color: "bg-blue-900/20 text-blue-400" },
            {
              label: "Messages Sent",
              value: totalMessages.toString(),
              icon: "📢",
              color: "bg-green-900/20 text-green-400",
            },
            { label: "Avg Read Rate", value: `${avgReadRate}%`, icon: "📈", color: "bg-purple-900/20 text-purple-400" },
            {
              label: "Pending Acks",
              value: pendingAcks.toString(),
              icon: "⏳",
              color: "bg-yellow-900/20 text-yellow-400",
            },
          ]
        })().map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-2xl`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 overflow-x-auto">
        {(["overview", "users", "groups", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors capitalize whitespace-nowrap ${
              activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab === "overview" && "📊"}
            {tab === "users" && "👥"}
            {tab === "groups" && "🏢"}
            {tab === "settings" && "⚙️"}
            {" " + tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Messages</CardTitle>
              <CardDescription className="text-slate-400">Last 5 messages sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No messages sent yet</p>
              ) : (
                messages.slice(0, 5).map((msg, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-700/50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-300 truncate">{msg.title}</p>
                      <p className="text-xs text-slate-500">{msg.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300 flex-shrink-0 ml-2">
                      {msg.totalRecipients}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-slate-400">Current system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Server Status</span>
                  <Badge className="bg-green-900 text-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Database</span>
                  <Badge className="bg-green-900 text-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">API Response</span>
                  <Badge className="bg-green-900 text-green-200">45ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Active Users</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    342
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">Manage system users and permissions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateStudent(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={18} className="mr-2" />
                  Add Student
                </Button>
                <Button onClick={() => setShowCreateStaff(true)} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus size={18} className="mr-2" />
                  Add Staff
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 text-slate-500" size={20} />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-300">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-400">{user.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge
                          variant="outline"
                          className={`${
                            user.role === "Admin"
                              ? "border-red-600 text-red-300"
                              : user.role === "Staff"
                                ? "border-blue-600 text-blue-300"
                                : "border-slate-600 text-slate-300"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge
                          className={`${
                            user.status === "active" ? "bg-green-900 text-green-200" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            handleEditUser(user.id)
                            setEditFormData(user)
                          }}
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm !== null && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-sm bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Confirm Delete</CardTitle>
                    <CardDescription className="text-slate-400">
                      Are you sure you want to delete this user? This action cannot be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 bg-transparent"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => confirmDelete(deleteConfirm)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Edit User Modal */}
            {editingUser !== null && (
              <EditUser
                userId={editingUser}
                initialData={editFormData || users.find((u) => u.id === editingUser)}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveEdit}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Groups Tab */}
      {activeTab === "groups" && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-white">Group Management</CardTitle>
                <CardDescription className="text-slate-400">Manage user groups and distribution lists</CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateGroup(!showCreateGroup)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={18} className="mr-2" />
                Create Group
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateGroup && (
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Group Name</label>
                  <Input
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Select Members</label>
                  <div className="bg-slate-700 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-600/50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={newGroupMembers.includes(user.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewGroupMembers([...newGroupMembers, user.email])
                            } else {
                              setNewGroupMembers(newGroupMembers.filter((m) => m !== user.email))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-300 text-sm">{user.name}</span>
                        <span className="text-xs text-slate-500">({user.role})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateGroup} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Create Group
                  </Button>
                  <Button
                    onClick={() => setShowCreateGroup(false)}
                    variant="outline"
                    className="flex-1 border-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {groups.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No groups created yet. Create your first group above.</p>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors flex-wrap gap-3"
                  >
                    <div className="flex-1 min-w-48">
                      <p className="font-medium text-slate-300">{group.name}</p>
                      <p className="text-sm text-slate-500">Created {group.createdDate}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {group.members.length} members
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          deleteGroup(group.id)
                          console.log("[v0] Group deleted:", group.id)
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Message Retention (days)</label>
                <Input type="number" defaultValue="90" className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Max File Upload Size (MB)</label>
                <Input type="number" defaultValue="10" className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Acknowledgment Timeout (hours)</label>
                <Input type="number" defaultValue="24" className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <input type="checkbox" id="notifications" defaultChecked className="w-4 h-4" />
                <label htmlFor="notifications" className="text-sm text-slate-300">
                  Enable email notifications for unacknowledged messages
                </label>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateStudent && (
        <CreateStudentUser onClose={() => setShowCreateStudent(false)} onSubmit={handleCreateStudent} />
      )}
      {showCreateStaff && <CreateStaffUser onClose={() => setShowCreateStaff(false)} onSubmit={handleCreateStaff} />}
    </div>
  )
}
