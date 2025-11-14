"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface CreateStudentUserProps {
  onClose: () => void
  onSubmit: (data: StudentData) => void
}

export interface StudentData {
  name: string
  age: number
  bloodGroup: string
  dob: string
  phoneNumber: string
  parentPhoneNumber: string
  course: string
  subCourse: string
  department: string
  responsibleStaff: string
  email: string
  password: string // added password field
}

export default function CreateStudentUser({ onClose, onSubmit }: CreateStudentUserProps) {
  const [formData, setFormData] = useState<StudentData>({
    name: "",
    age: 0,
    bloodGroup: "",
    dob: "",
    phoneNumber: "",
    parentPhoneNumber: "",
    course: "",
    subCourse: "",
    department: "",
    responsibleStaff: "",
    email: "",
    password: "", // initialize password
  })

  const generateEmail = (name: string) => {
    const emailBase = name
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z.]/g, "")
    return `${emailBase}@college.edu`
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      email: name ? generateEmail(name) : "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.age &&
      formData.bloodGroup &&
      formData.dob &&
      formData.phoneNumber &&
      formData.parentPhoneNumber &&
      formData.course &&
      formData.subCourse &&
      formData.department &&
      formData.responsibleStaff &&
      formData.password // validate password is set
    ) {
      onSubmit(formData)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-slate-800 border-b border-slate-700">
          <div>
            <CardTitle className="text-white">Create Student User</CardTitle>
            <CardDescription className="text-slate-400">Add a new student to the system</CardDescription>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Full Name *</label>
                <Input
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="John Doe"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Age *</label>
                <Input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  placeholder="20"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Phone Number *</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Parent Phone Number *</label>
                <Input
                  value={formData.parentPhoneNumber}
                  onChange={(e) => setFormData({ ...formData, parentPhoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Course *</label>
                <Input
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="B.Tech"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Sub Course *</label>
                <Input
                  value={formData.subCourse}
                  onChange={(e) => setFormData({ ...formData, subCourse: e.target.value })}
                  placeholder="Computer Science"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Department *</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Engineering"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Responsible Staff *</label>
                <Input
                  value={formData.responsibleStaff}
                  onChange={(e) => setFormData({ ...formData, responsibleStaff: e.target.value })}
                  placeholder="Staff Name"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-300 block mb-2">Email Address</label>
                <Input
                  value={formData.email}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Auto-generated from name</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-300 block mb-2">Password *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set a password (min 6 characters)"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Student will use this to login</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Create Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
