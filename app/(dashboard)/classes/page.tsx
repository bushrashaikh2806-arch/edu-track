"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  CalendarCheck,
  Check,
  Clock,
  Users,
  UserX,
  Search,
  AlertTriangle,
} from "lucide-react"

import { getClassesOverview } from "@/lib/api"

type SubjectData = {
  subject: string
  lectures: number
  present: number
  late: number
  absent: number
  attendance_percentage: number
}

type ClassData = {
  class_name: string
  division: string
  students: number
  present: number
  late: number
  absent: number
  attendance_percentage: number
}

type ClassStudentData = {
  id: string
  name: string
  roll_no: string
  email: string | null
  present: number
  late: number
  absent: number
  attendance_percentage: number
}

type LectureActivity = {
  id: string
  subject: string
  title: string
  class_name: string
  division: string | null
  date: string
  start_time: string | null
  end_time: string | null
  teacher: string
  present: number
  late: number
  absent: number
  completed: boolean
}

type ClassesOverview = {
  today: {
    date: string
    lectures_completed: number
    total_students: number
    present: number
    late: number
    absent: number
  }
  subject_wise: SubjectData[]
  class_wise: ClassData[]
  lecture_activity: LectureActivity[]
}

export default function ClassesPage() {
  const [data, setData] = useState<ClassesOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [classStudents, setClassStudents] = useState<ClassStudentData[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentSearch, setStudentSearch] = useState("")

  useEffect(() => {
    async function loadClassesData() {
      try {
        setLoading(true)

        const result = await getClassesOverview()

        setData(result)
      } catch (err) {
        console.error(err)
        setError("Failed to load classes data.")
      } finally {
        setLoading(false)
      }
    }

    loadClassesData()
  }, [])

  useEffect(() => {
    async function loadClassStudents() {
      if (!selectedClass) {
        setClassStudents([])
        return
      }

      const [className, division] = selectedClass.split("|||")

      try {
        setStudentsLoading(true)

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://127.0.0.1:8000"

        const response = await fetch(
          `${API_BASE_URL}/classes/students?class_name=${encodeURIComponent(
            className,
          )}&division=${encodeURIComponent(division)}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch class students")
        }

        const result = await response.json()

        setClassStudents(result)
      } catch (err) {
        console.error(err)
        setClassStudents([])
      } finally {
        setStudentsLoading(false)
      }
    }

    loadClassStudents()
  }, [selectedClass])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Loading classes data...
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">
          {error || "No classes data available."}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Make sure the backend server is running.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Classes
        </h2>

        <p className="text-sm text-muted-foreground">
          Monitor class-wise and subject-wise attendance.
        </p>
      </div>

      {/* TODAY'S OVERVIEW */}

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Today&apos;s Overview
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Lectures */}

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Lectures Completed
                </p>

                <p className="text-2xl font-semibold">
                  {data.today.lectures_completed}
                </p>
              </div>
            </div>
          </div>

          {/* Students */}

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Students
                </p>

                <p className="text-2xl font-semibold">
                  {data.today.total_students}
                </p>
              </div>
            </div>
          </div>

          {/* Present */}

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Check className="size-5 text-success" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Present
                </p>

                <p className="text-2xl font-semibold">
                  {data.today.present}
                </p>
              </div>
            </div>
          </div>

          {/* Late */}

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="size-5 text-warning" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Late
                </p>

                <p className="text-2xl font-semibold">
                  {data.today.late}
                </p>
              </div>
            </div>
          </div>

          {/* Absent */}

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <UserX className="size-5 text-destructive" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Absent
                </p>

                <p className="text-2xl font-semibold">
                  {data.today.absent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT-WISE */}

      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5" />

            <div>
              <h3 className="font-semibold">
                Subject-wise Attendance
              </h3>

              <p className="text-sm text-muted-foreground">
                Attendance performance for each subject.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {data.subject_wise.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium">
                No subjects available
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a lecture to see subject attendance.
              </p>
            </div>
          ) : (
            data.subject_wise.map((subject) => (
              <div
                key={subject.subject}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookOpen className="size-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {subject.subject}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {subject.lectures}{" "}
                      {subject.lectures === 1
                        ? "lecture"
                        : "lectures"}{" "}
                      completed
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      Present
                    </p>

                    <p className="font-semibold">
                      {subject.present}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Late
                    </p>

                    <p className="font-semibold">
                      {subject.late}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Absent
                    </p>

                    <p className="font-semibold">
                      {subject.absent}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Attendance
                    </p>

                    <p className="font-semibold">
                      {subject.attendance_percentage}%
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CLASS-WISE */}

      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Users className="size-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Class-wise Attendance
                </h3>

                <p className="text-sm text-muted-foreground">
                  Select a class to view student-level attendance.
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value)
                  setStudentSearch("")
                }}
                className="h-10 w-full appearance-none rounded-lg border bg-background pl-9 pr-9 text-sm outline-none transition focus:border-primary"
              >
                <option value="">Select a class</option>

                {data.class_wise.map((classData) => (
                  <option
                    key={`${classData.class_name}-${classData.division}`}
                    value={`${classData.class_name}|||${classData.division}`}
                  >
                    {classData.class_name} - {classData.division}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!selectedClass ? (
          <div className="flex min-h-[260px] items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="size-6 text-primary" />
              </div>

              <p className="font-semibold">
                Select a class
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose a class and division above to view its
                attendance summary and individual student records.
              </p>
            </div>
          </div>
        ) : (
          (() => {
            const selected = data.class_wise.find(
              (classData) =>
                `${classData.class_name}|||${classData.division}` ===
                selectedClass,
            )

            const filteredStudents = classStudents.filter((student) =>
              `${student.name} ${student.roll_no}`
                .toLowerCase()
                .includes(studentSearch.toLowerCase()),
            )

            return (
              <div>
                {selected && (
                  <div className="border-b p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-xl font-semibold">
                            {selected.class_name} - {selected.division}
                          </h4>

                          {selected.attendance_percentage < 75 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                              <AlertTriangle className="size-3.5" />
                              Below 75%
                            </span>
                          ) : (
                            <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                              Good attendance
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {selected.students}{" "}
                          {selected.students === 1
                            ? "student"
                            : "students"}{" "}
                          in this class
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-sm text-muted-foreground">
                          Overall Attendance
                        </p>

                        <p className="text-3xl font-bold">
                          {selected.attendance_percentage}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-xl bg-success/10 p-4">
                        <p className="text-xs text-muted-foreground">
                          Present
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {selected.present}
                        </p>
                      </div>

                      <div className="rounded-xl bg-warning/10 p-4">
                        <p className="text-xs text-muted-foreground">
                          Late
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {selected.late}
                        </p>
                      </div>

                      <div className="rounded-xl bg-destructive/10 p-4">
                        <p className="text-xs text-muted-foreground">
                          Absent
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {selected.absent}
                        </p>
                      </div>

                      <div className="rounded-xl bg-primary/10 p-4">
                        <p className="text-xs text-muted-foreground">
                          Students
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {selected.students}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold">
                        Student Attendance
                      </h4>

                      <p className="text-sm text-muted-foreground">
                        Individual attendance records for this class.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        value={studentSearch}
                        onChange={(event) =>
                          setStudentSearch(event.target.value)
                        }
                        placeholder="Search student..."
                        className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {studentsLoading ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 size-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                        <p className="text-sm text-muted-foreground">
                          Loading students...
                        </p>
                      </div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="rounded-xl border py-10 text-center">
                      <Users className="mx-auto mb-3 size-8 text-muted-foreground" />

                      <p className="font-medium">
                        No students found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        No student records are available for this class.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-muted/40">
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">
                              Student
                            </th>

                            <th className="px-4 py-3 text-left font-medium">
                              Roll No.
                            </th>

                            <th className="px-4 py-3 text-center font-medium">
                              Present
                            </th>

                            <th className="px-4 py-3 text-center font-medium">
                              Late
                            </th>

                            <th className="px-4 py-3 text-center font-medium">
                              Absent
                            </th>

                            <th className="px-4 py-3 text-right font-medium">
                              Attendance
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y">
                          {filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              className="transition hover:bg-muted/30"
                            >
                              <td className="px-4 py-4">
                                <div className="font-medium">
                                  {student.name}
                                </div>

                                {student.email && (
                                  <div className="mt-0.5 text-xs text-muted-foreground">
                                    {student.email}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {student.roll_no}
                              </td>

                              <td className="px-4 py-4 text-center font-medium">
                                {student.present}
                              </td>

                              <td className="px-4 py-4 text-center font-medium">
                                {student.late}
                              </td>

                              <td className="px-4 py-4 text-center font-medium">
                                {student.absent}
                              </td>

                              <td className="px-4 py-4 text-right">
                                <span
                                  className={`font-semibold ${
                                    student.attendance_percentage < 75
                                      ? "text-destructive"
                                      : "text-success"
                                  }`}
                                >
                                  {student.attendance_percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )
          })()
        )}
      </div>

      {/* TODAY'S LECTURE ACTIVITY */}

      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5" />

            <div>
              <h3 className="font-semibold">
                Today&apos;s Lecture Activity
              </h3>

              <p className="text-sm text-muted-foreground">
                Classes and lectures completed today.
              </p>
            </div>
          </div>
        </div>

        {data.lecture_activity.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <CalendarCheck className="mx-auto mb-3 size-10 text-muted-foreground" />

              <p className="font-medium">
                No lectures scheduled today
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Today&apos;s lectures will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {data.lecture_activity.map((lecture) => (
              <div
                key={lecture.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookOpen className="size-5 text-primary" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {lecture.title}
                      </p>

                      {lecture.completed && (
                        <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {lecture.subject} • {lecture.class_name}{" "}
                      {lecture.division
                        ? `- ${lecture.division}`
                        : ""}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Teacher: {lecture.teacher || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      Present
                    </p>

                    <p className="font-semibold">
                      {lecture.present}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Late
                    </p>

                    <p className="font-semibold">
                      {lecture.late}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Absent
                    </p>

                    <p className="font-semibold">
                      {lecture.absent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}