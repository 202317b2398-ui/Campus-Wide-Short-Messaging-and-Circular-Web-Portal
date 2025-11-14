"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface CreateStaffUserProps {
  onClose: () => void
  onSubmit: (data: StaffData) => void
}

export interface StaffData {
  name: string
  age: number
  bloodGroup: string
  phoneNumber: string
  department: string
  email: string
  password: string // added password field
}

export default function CreateStaffUser({ onClose, onSubmit }: CreateStaffUserProps) {
  const [formData, setFormData] = useState<StaffData>({
    name: "",
    age: 0,
    bloodGroup: "",
    phoneNumber: "",
    department: "",
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
      formData.phoneNumber &&
      formData.department &&
      formData.password
    ) {
      // validate password
      onSubmit(formData)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700">
          <div>
            <CardTitle className="text-white">Create Staff User</CardTitle>
            <CardDescription className="text-slate-400">Add a new staff member to the system</CardDescription>
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
                  placeholder="Jane Smith"
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
                  placeholder="35"
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
                <label className="text-sm font-medium text-slate-300 block mb-2">Phone Number *</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-300 block mb-2">Department *</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science"
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
                <p className="text-xs text-slate-500 mt-1">Staff will use this to login</p>
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
                Create Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
