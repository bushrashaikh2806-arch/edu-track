"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

import { getStudents } from "@/lib/api"
import { CLASSES, DIVISIONS, ACADEMIC_YEARS } from "@/lib/mock-data"

import type { Student } from "@/lib/types"

const API_BASE_URL = "http://127.0.0.1:8000"

const empty = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phone: "",
  password: "",
  studentId: "",
  rollNumber: "",
  className: "",
  division: "",
  academicYear: ACADEMIC_YEARS[0],
}

type FormState = typeof empty

type Errors = Partial<Record<keyof FormState, string>>

export function AddStudentDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (student: Student) => void
}) {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function set<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }))
  }

  function validate(): boolean {
    const next: Errors = {}

    if (!form.fullName.trim()) {
      next.fullName = "Full name is required."
    }

    if (!form.email.trim()) {
      next.email = "Email is required."
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      next.email = "Enter a valid email address."
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required."
    }

    if (!form.password.trim()) {
      next.password = "Password is required."
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters."
    }

    if (!form.studentId.trim()) {
      next.studentId = "Student ID is required."
    }

    if (!form.rollNumber.trim()) {
      next.rollNumber = "Roll number is required."
    }

    if (!form.className) {
      next.className = "Select a class."
    }

    if (!form.division) {
      next.division = "Select a division."
    }

    if (!form.gender) {
      next.gender = "Select a gender."
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) {
      toast.error("Please fix the highlighted fields.")
      return
    }

    setSaving(true)

    try {
      // Create Supabase Auth account + student record
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
            role: "student",

            roll_no: form.rollNumber.trim(),
            class_name: form.className,
            division: form.division,

            employee_id: null,
            phone: form.phone.trim(),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create student account.",
        )
      }

      // Get the freshly-created student in the frontend format
      const students = await getStudents()

      const createdStudent = students.find(
        (student: Student) =>
          student.email?.toLowerCase() ===
          form.email.trim().toLowerCase(),
      )

      if (!createdStudent) {
        throw new Error(
          "Account was created, but the student record could not be loaded.",
        )
      }

      toast.success("Student account created successfully.")

      onCreated?.(createdStudent)

      setForm(empty)
      setErrors({})
      setShowPassword(false)

      onOpenChange(false)
    } catch (error) {
      console.error("Create student error:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create student account.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto sm:max-w-2xl">

        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>

          <DialogDescription>
            Create a student record and their login account.
            Fields marked with an asterisk are required.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 py-4"
        >

          {/* Personal Information */}
          <FieldSet>
            <FieldLegend variant="label">
              Personal information
            </FieldLegend>

            <FieldGroup className="@container">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Full Name */}
                <Field data-invalid={!!errors.fullName}>
                  <FieldLabel htmlFor="fullName">
                    Full name *
                  </FieldLabel>

                  <Input
                    id="fullName"
                    value={form.fullName}
                    aria-invalid={!!errors.fullName}
                    onChange={(e) =>
                      set("fullName", e.target.value)
                    }
                    placeholder="e.g. Bushra Shaikh"
                    disabled={saving}
                  />

                  <FieldError>
                    {errors.fullName}
                  </FieldError>
                </Field>

                {/* Gender */}
                <Field data-invalid={!!errors.gender}>
                  <FieldLabel htmlFor="gender">
                    Gender *
                  </FieldLabel>

                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      set("gender", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger
                      id="gender"
                      className="w-full"
                      aria-invalid={!!errors.gender}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="female">
                        Female
                      </SelectItem>

                      <SelectItem value="male">
                        Male
                      </SelectItem>

                      <SelectItem value="other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FieldError>
                    {errors.gender}
                  </FieldError>
                </Field>

                {/* Email */}
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">
                    Email *
                  </FieldLabel>

                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    aria-invalid={!!errors.email}
                    onChange={(e) =>
                      set("email", e.target.value)
                    }
                    placeholder="student@example.com"
                    disabled={saving}
                  />

                  <FieldError>
                    {errors.email}
                  </FieldError>
                </Field>

                {/* Phone */}
                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="phone">
                    Phone number *
                  </FieldLabel>

                  <Input
                    id="phone"
                    value={form.phone}
                    aria-invalid={!!errors.phone}
                    onChange={(e) =>
                      set("phone", e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    disabled={saving}
                  />

                  <FieldError>
                    {errors.phone}
                  </FieldError>
                </Field>

                {/* Date of Birth */}
                <Field>
                  <FieldLabel htmlFor="dob">
                    Date of birth
                  </FieldLabel>

                  <Input
                    id="dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      set("dateOfBirth", e.target.value)
                    }
                    disabled={saving}
                  />
                </Field>

              </div>
            </FieldGroup>
          </FieldSet>

          {/* Login Information */}
          <FieldSet>
            <FieldLegend variant="label">
              Login information
            </FieldLegend>

            <FieldGroup>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">
                  Temporary password *
                </FieldLabel>

                <div className="relative">
                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    aria-invalid={!!errors.password}
                    onChange={(e) =>
                      set("password", e.target.value)
                    }
                    placeholder="Minimum 6 characters"
                    className="pr-10"
                    disabled={saving}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    disabled={saving}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Give this password to the student. They can
                  change it later from Settings.
                </p>

                <FieldError>
                  {errors.password}
                </FieldError>
              </Field>

            </FieldGroup>
          </FieldSet>

          {/* Academic Information */}
          <FieldSet>
            <FieldLegend variant="label">
              Academic information
            </FieldLegend>

            <FieldGroup>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Student ID */}
                <Field data-invalid={!!errors.studentId}>
                  <FieldLabel htmlFor="studentId">
                    Student ID *
                  </FieldLabel>

                  <Input
                    id="studentId"
                    value={form.studentId}
                    aria-invalid={!!errors.studentId}
                    onChange={(e) =>
                      set("studentId", e.target.value)
                    }
                    placeholder="EDU1049"
                    disabled={saving}
                  />

                  <FieldError>
                    {errors.studentId}
                  </FieldError>
                </Field>

                {/* Roll Number */}
                <Field data-invalid={!!errors.rollNumber}>
                  <FieldLabel htmlFor="rollNumber">
                    Roll number *
                  </FieldLabel>

                  <Input
                    id="rollNumber"
                    value={form.rollNumber}
                    aria-invalid={!!errors.rollNumber}
                    onChange={(e) =>
                      set("rollNumber", e.target.value)
                    }
                    placeholder="149"
                    disabled={saving}
                  />

                  <FieldError>
                    {errors.rollNumber}
                  </FieldError>
                </Field>

                {/* Class */}
                <Field data-invalid={!!errors.className}>
                  <FieldLabel htmlFor="className">
                    Class *
                  </FieldLabel>

                  <Select
                    value={form.className}
                    onValueChange={(value) =>
                      set("className", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger
                      id="className"
                      className="w-full"
                      aria-invalid={!!errors.className}
                    >
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>

                    <SelectContent>
                      {CLASSES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldError>
                    {errors.className}
                  </FieldError>
                </Field>

                {/* Division */}
                <Field data-invalid={!!errors.division}>
                  <FieldLabel htmlFor="division">
                    Division *
                  </FieldLabel>

                  <Select
                    value={form.division}
                    onValueChange={(value) =>
                      set("division", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger
                      id="division"
                      className="w-full"
                      aria-invalid={!!errors.division}
                    >
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>

                    <SelectContent>
                      {DIVISIONS.map((d) => (
                        <SelectItem
                          key={d}
                          value={d}
                        >
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldError>
                    {errors.division}
                  </FieldError>
                </Field>

                {/* Academic Year */}
                <Field>
                  <FieldLabel htmlFor="academicYear">
                    Academic year
                  </FieldLabel>

                  <Select
                    value={form.academicYear}
                    onValueChange={(value) =>
                      set("academicYear", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger
                      id="academicYear"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>

                    <SelectContent>
                      {ACADEMIC_YEARS.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

              </div>
            </FieldGroup>
          </FieldSet>

          {/* Footer */}
          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <Loader2
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : (
                <UserPlus data-icon="inline-start" />
              )}

              {saving
                ? "Creating account..."
                : "Create student"}
            </Button>

          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}