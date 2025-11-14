"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface User {
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
}

interface EditUserProps {
  userId: number
  initialData?: Partial<User>
  onClose: () => void
  onSave: (userId: number) => void
}

export default function EditUser({ userId, initialData, onClose, onSave }: EditUserProps) {
  const [formData, setFormData] = useState<Partial<User>>(initialData || {})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSave(userId)
    setIsSaving(false)
  }

  const isStudent = formData.role === "Student"
  const isStaff = formData.role === "Staff"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-96 overflow-y-auto bg-slate-800 border-slate-700">
        <CardHeader className="flex items-center justify-between flex-row">
          <div>
            <CardTitle className="text-white">Edit User</CardTitle>
            <CardDescription className="text-slate-400">Update user information</CardDescription>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Name</label>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="Full name"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <Input
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="email@college.edu"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Age</label>
            <Input
              name="age"
              type="number"
              value={formData.age || ""}
              onChange={handleInputChange}
              placeholder="Age"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Blood Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Blood Group</label>
            <Input
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleInputChange}
              placeholder="A+, B-, O+, etc."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Phone Number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Department</label>
            <Input
              name="department"
              value={formData.department || ""}
              onChange={handleInputChange}
              placeholder="Department"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Student-specific fields */}
          {isStudent && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">DOB</label>
                <Input
                  name="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Parent Phone Number</label>
                <Input
                  name="parentPhoneNumber"
                  value={formData.parentPhoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Parent phone number"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Course</label>
                <Input
                  name="course"
                  value={formData.course || ""}
                  onChange={handleInputChange}
                  placeholder="Course"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Sub Course</label>
                <Input
                  name="subCourse"
                  value={formData.subCourse || ""}
                  onChange={handleInputChange}
                  placeholder="Sub course"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Responsible Staff</label>
                <Input
                  name="responsibleStaff"
                  value={formData.responsibleStaff || ""}
                  onChange={handleInputChange}
                  placeholder="Staff name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </>
          )}

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              name="status"
              value={formData.status || "active"}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
