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

import { getStudents } from "@/lib/api"
import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
                            <DropdownMenuItem>
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              Delete
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

    </div>
  )
}