"use client"

import { AddStudentDialog } from "@/components/students/add-student-dialog"
import { useEffect, useMemo, useState } from "react"

import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  UserCheck,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"

import {
  getStudents,
  updateStudent,
  deleteStudent,
} from "@/lib/api"

import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [addStudentOpen, setAddStudentOpen] = useState(false)

  const [editStudentOpen, setEditStudentOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [editForm, setEditForm] = useState({
    fullName: "",
    rollNumber: "",
    className: "",
    division: "",
    email: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true)
        setError("")

        const data = await getStudents()
        setStudents(data)
      } catch (err) {
        console.error(err)
        setError("Unable to load students.")
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim()

    if (!value) {
      return students
    }

    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(value) ||
        student.rollNumber.toLowerCase().includes(value) ||
        student.className.toLowerCase().includes(value) ||
        student.division.toLowerCase().includes(value),
    )
  }, [students, search])

  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length

  // Open Edit Dialog
  function handleEdit(student: Student) {
    setSelectedStudent(student)

    setEditForm({
      fullName: student.fullName,
      rollNumber: student.rollNumber,
      className: student.className,
      division: student.division,
      email: student.email,
    })

    setEditStudentOpen(true)
  }

  // Save edited student
  async function handleSaveEdit() {
    if (!selectedStudent) return

    if (!editForm.fullName.trim()) {
      alert("Student name is required.")
      return
    }

    if (!editForm.rollNumber.trim()) {
      alert("Roll number is required.")
      return
    }

    try {
      setSavingEdit(true)

      const updatedStudent = await updateStudent(
        selectedStudent.id,
        {
          fullName: editForm.fullName.trim(),
          rollNumber: editForm.rollNumber.trim(),
          className: editForm.className.trim(),
          division: editForm.division.trim(),
          email: editForm.email.trim(),
        },
      )

      setStudents((current) =>
        current.map((student) =>
          student.id === updatedStudent.id
            ? {
                ...student,
                ...updatedStudent,
              }
            : student,
        ),
      )

      setEditStudentOpen(false)
      setSelectedStudent(null)

      alert("Student updated successfully.")
    } catch (err) {
      console.error(err)
      alert("Failed to update student.")
    } finally {
      setSavingEdit(false)
    }
  }

  // Delete student
  async function handleDelete(student: Student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.fullName}?`,
    )

    if (!confirmed) return

    try {
      setDeletingStudentId(student.id)

      await deleteStudent(student.id)

      setStudents((current) =>
        current.filter((item) => item.id !== student.id),
      )

      alert("Student deleted successfully.")
    } catch (err) {
      console.error(err)
      alert("Failed to delete student.")
    } finally {
      setDeletingStudentId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Students
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage student records and academic information.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => setAddStudentOpen(true)}
        >
          <Plus className="size-4" />
          Add Student
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Total Students */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total students
              </p>

              <p className="text-2xl font-semibold">
                {students.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-success/10">
              <UserCheck className="size-5 text-success" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Active students
              </p>

              <p className="text-2xl font-semibold">
                {activeStudents}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Students Table */}
      <Card>

        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <CardTitle>
                Student records
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredStudents.length} students found
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-0">

          {/* Loading */}
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading students...
            </div>

          ) : error ? (

            /* Error */
            <div className="flex h-40 items-center justify-center text-sm text-destructive">
              {error}
            </div>

          ) : filteredStudents.length === 0 ? (

            /* No Students */
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              No students found.
            </div>

          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                {/* Table Header */}
                <thead>
                  <tr className="border-b bg-muted/30">

                    <th className="px-6 py-4 text-left font-medium">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left font-medium">
                      Roll No.
                    </th>

                    <th className="px-6 py-4 text-left font-medium">
                      Class
                    </th>

                    <th className="px-6 py-4 text-left font-medium">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>

                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredStudents.map((student) => (

                    <tr
                      key={student.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >

                      {/* Student */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {student.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-medium">
                              {student.fullName}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              ID: {student.studentId.slice(0, 8)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Roll Number */}
                      <td className="px-6 py-4 tabular-nums">
                        {student.rollNumber}
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium">
                            {student.className || "—"}
                          </p>

                          {student.division && (
                            <p className="text-xs text-muted-foreground">
                              Division {student.division}
                            </p>
                          )}

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.email || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <span
                          className={
                            student.status === "active"
                              ? "inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                              : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {student.status}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">

                        <DropdownMenu>

                          <DropdownMenuTrigger
                            aria-label="Student actions"
                            className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            {/* Edit */}
                            <DropdownMenuItem
                              onClick={() => handleEdit(student)}
                            >
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              disabled={deletingStudentId === student.id}
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              {deletingStudentId === student.id
                                ? "Deleting..."
                                : "Delete"}
                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onCreated={(student) => {
          setStudents((current) => [student, ...current])
        }}
      />

      {/* Edit Student Dialog */}
      <Dialog
        open={editStudentOpen}
        onOpenChange={setEditStudentOpen}
      >
        <DialogContent className="sm:max-w-[500px]">

          <DialogHeader>
            <DialogTitle>
              Edit Student
            </DialogTitle>

            <DialogDescription>
              Update the student's academic and contact information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-full-name">
                Full Name
              </Label>

              <Input
                id="edit-full-name"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter full name"
              />
            </div>

            {/* Roll Number */}
            <div className="grid gap-2">
              <Label htmlFor="edit-roll-number">
                Roll Number
              </Label>

              <Input
                id="edit-roll-number"
                value={editForm.rollNumber}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    rollNumber: e.target.value,
                  })
                }
                placeholder="Enter roll number"
              />
            </div>

            {/* Class */}
            <div className="grid gap-2">
              <Label htmlFor="edit-class">
                Class
              </Label>

              <Input
                id="edit-class"
                value={editForm.className}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    className: e.target.value,
                  })
                }
                placeholder="Enter class"
              />
            </div>

            {/* Division */}
            <div className="grid gap-2">
              <Label htmlFor="edit-division">
                Division
              </Label>

              <Input
                id="edit-division"
                value={editForm.division}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    division: e.target.value,
                  })
                }
                placeholder="Enter division"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="edit-email">
                Email
              </Label>

              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email: e.target.value,
                  })
                }
                placeholder="Enter email"
              />
            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setEditStudentOpen(false)}
              disabled={savingEdit}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSaveEdit}
              disabled={savingEdit}
            >
              {savingEdit ? "Saving..." : "Save Changes"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  )
}