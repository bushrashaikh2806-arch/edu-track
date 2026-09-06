"use client"

import { useEffect, useState } from "react"
import {
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  UserCog,
  Eye,
  EyeOff,
} from "lucide-react"

import {
  getStaff,
  updateStaff,
  deleteStaff,
} from "@/lib/api"

import type { Staff } from "@/lib/types"

const API_BASE_URL = "http://127.0.0.1:8000"

type FormData = {
  fullName: string
  staffId: string
  email: string
  phone: string
  password: string
  role: "Teacher" | "Coordinator" | "Administrator"
}

const emptyForm: FormData = {
  fullName: "",
  staffId: "",
  email: "",
  phone: "",
  password: "",
  role: "Teacher",
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [form, setForm] = useState<FormData>(emptyForm)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // -----------------------------
  // LOAD STAFF
  // -----------------------------

  async function loadStaff() {
    try {
      setLoading(true)
      setMessage("")

      const data = await getStaff()

      setStaff(data)
    } catch (error) {
      console.error(error)
      setMessage("Failed to load staff.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------

  function handleChange(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  // -----------------------------
  // ADD / UPDATE
  // -----------------------------

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!form.fullName.trim()) {
      setMessage("Please enter teacher name.")
      return
    }

    if (!form.email.trim()) {
      setMessage("Please enter teacher email.")
      return
    }

    if (!editingId && !form.password) {
      setMessage("Please enter a password.")
      return
    }

    if (!editingId && form.password.length < 6) {
      setMessage("Password must be at least 6 characters.")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      // -----------------------------
      // UPDATE EXISTING STAFF
      // -----------------------------

      if (editingId) {
        const updated = await updateStaff(
          editingId,
          {
            fullName: form.fullName.trim(),
            staffId: form.staffId.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            role: form.role,
          }
        )

        setStaff((current) =>
          current.map((item) =>
            item.id === editingId
              ? updated
              : item
          )
        )

        setMessage(
          "Staff updated successfully! ✅"
        )
      }

      // -----------------------------
      // CREATE NEW ACCOUNT
      // -----------------------------

      else {
        const response = await fetch(
          `${API_BASE_URL}/accounts/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: form.email.trim(),
              password: form.password,
              name: form.fullName.trim(),
              role: "teacher",

              employee_id:
                form.staffId.trim() || null,

              phone:
                form.phone.trim() || null,

              roll_no: null,
              class_name: null,
              division: null,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Failed to create teacher account."
          )
        }

        /*
         * Reload staff from backend.
         *
         * This is better than manually creating
         * a fake frontend object because the backend
         * has already created the real staff record.
         */

        const updatedStaff = await getStaff()

        setStaff(updatedStaff)

        setMessage(
          "Teacher account created successfully! ✅"
        )
      }

      // -----------------------------
      // RESET FORM
      // -----------------------------

      setForm(emptyForm)
      setEditingId(null)
      setShowPassword(false)

    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : editingId
            ? "Failed to update staff."
            : "Failed to create teacher account."
      )
    } finally {
      setSaving(false)
    }
  }

  // -----------------------------
  // EDIT
  // -----------------------------

  function handleEdit(member: Staff) {
    setEditingId(member.id)

    setForm({
      fullName: member.fullName,
      staffId: member.staffId,
      email: member.email,
      phone: member.phone,
      password: "",
      role: member.role,
    })

    setMessage("")
  }

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage("")
    setShowPassword(false)
  }

  // -----------------------------
  // DELETE
  // -----------------------------

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteStaff(id)

      setStaff((current) =>
        current.filter(
          (member) => member.id !== id
        )
      )

      setMessage(
        "Staff deleted successfully! ✅"
      )
    } catch (error) {
      console.error(error)

      setMessage(
        "Failed to delete staff."
      )
    }
  }

  // -----------------------------
  // COUNTS
  // -----------------------------

  const teacherCount = staff.filter(
    (member) => member.role === "Teacher"
  ).length

  const coordinatorCount = staff.filter(
    (member) => member.role === "Coordinator"
  ).length

  const administratorCount = staff.filter(
    (member) => member.role === "Administrator"
  ).length

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">
          Loading staff...
        </p>
      </div>
    )
  }

  // -----------------------------
  // PAGE
  // -----------------------------

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Teachers & Staff
        </h2>

        <p className="text-sm text-muted-foreground">
          Manage teachers, staff members and their login accounts.
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Staff
              </p>

              <p className="text-2xl font-semibold">
                {staff.length}
              </p>
            </div>

          </div>
        </div>

        {/* TEACHERS */}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-success/10 p-2">
              <GraduationCap className="size-5 text-success" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Teachers
              </p>

              <p className="text-2xl font-semibold">
                {teacherCount}
              </p>
            </div>

          </div>
        </div>

        {/* COORDINATORS */}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-warning/10 p-2">
              <UserCog className="size-5 text-warning" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Coordinators
              </p>

              <p className="text-2xl font-semibold">
                {coordinatorCount}
              </p>
            </div>

          </div>
        </div>

        {/* ADMINISTRATORS */}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-destructive/10 p-2">
              <UserCog className="size-5 text-destructive" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Administrators
              </p>

              <p className="text-2xl font-semibold">
                {administratorCount}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ADD / EDIT FORM */}

      <div className="rounded-xl border bg-card p-5">

        <div className="mb-5">
          <h3 className="font-semibold">
            {editingId
              ? "Edit Staff"
              : "Create Teacher Account"}
          </h3>

          <p className="text-sm text-muted-foreground">
            {editingId
              ? "Update staff information."
              : "Create a teacher profile and login account."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >

          {/* FULL NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                handleChange(
                  "fullName",
                  e.target.value
                )
              }
              placeholder="Enter full name"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* EMPLOYEE ID */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee ID
            </label>

            <input
              type="text"
              value={form.staffId}
              onChange={(e) =>
                handleChange(
                  "staffId",
                  e.target.value
                )
              }
              placeholder="e.g. T001"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value
                )
              }
              placeholder="teacher@example.com"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              placeholder="9876543210"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* PASSWORD */}

          {!editingId && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Login Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    handleChange(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                This password will be used by the teacher to log in.
              </p>
            </div>
          )}

          {/* ROLE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                handleChange(
                  "role",
                  e.target.value
                )
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Teacher">
                Teacher
              </option>

              <option value="Coordinator">
                Coordinator
              </option>

              <option value="Administrator">
                Administrator
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="flex items-end gap-2">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : editingId
                  ? "Update Staff"
                  : "Create Teacher"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-success/20 bg-success/5 text-success"
                : "border-destructive/20 bg-destructive/5 text-destructive"
            }`}
          >
            {message}
          </div>
        )}

      </div>

      {/* STAFF LIST */}

      <div className="rounded-xl border bg-card">

        <div className="border-b p-5">

          <h3 className="font-semibold">
            Staff Members
          </h3>

          <p className="text-sm text-muted-foreground">
            {staff.length} staff members
          </p>

        </div>

        {staff.length === 0 ? (

          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">
              No staff members found.
            </p>
          </div>

        ) : (

          <div className="divide-y">

            {staff.map((member) => (

              <div
                key={member.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >

                {/* INFORMATION */}

                <div className="flex items-center gap-4">

                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {member.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <p className="font-medium">
                      {member.fullName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {member.staffId ||
                        "No Employee ID"}
                      {" · "}
                      {member.role}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {member.email ||
                        "No email"}
                      {" · "}
                      {member.phone ||
                        "No phone"}
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(member)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(member.id)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-background px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}