"use client"

import { useEffect, useState } from "react"

import {
  BarChart3,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getReportsOverview } from "@/lib/api"

type StudentReport = {
  id: string
  name: string
  roll_no: string
  class_name: string | null
  division: string | null
  email: string | null
  present: number
  absent: number
  late: number
  total_lectures: number
  attendance_percentage: number
  below_75: boolean
}

type SubjectReport = {
  subject: string
  lectures: number
  present: number
  absent: number
  late: number
  attendance_percentage: number
}

type ReportsData = {
  overview: {
    total_students: number
    total_lectures: number
    total_attendance_records: number
    present: number
    absent: number
    late: number
    attendance_percentage: number
  }
  student_reports: StudentReport[]
  below_75: StudentReport[]
  subject_reports: SubjectReport[]
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadReports() {
      try {
        const result = await getReportsOverview()
        setData(result)
      } catch (error) {
        console.error(error)
        setError("Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading reports...
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-destructive">
          {error || "No report data available"}
        </p>
      </div>
    )
  }

  const overview = data.overview

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Reports
        </h2>

        <p className="text-sm text-muted-foreground">
          View and analyze student attendance reports.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Overall Attendance */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Overall Attendance
              </p>

              <p className="text-2xl font-semibold">
                {overview.attendance_percentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Present */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-success/10">
              <UserCheck className="size-5 text-success" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Present
              </p>

              <p className="text-2xl font-semibold">
                {overview.present}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Absent */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10">
              <UserX className="size-5 text-destructive" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Absent
              </p>

              <p className="text-2xl font-semibold">
                {overview.absent}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Late */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="size-5 text-warning" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Late
              </p>

              <p className="text-2xl font-semibold">
                {overview.late}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            Report summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Total Students
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {overview.total_students}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Total Lectures
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {overview.total_lectures}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Attendance Records
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {overview.total_attendance_records}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Student Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>
            Student attendance report
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">

                  <th className="px-4 py-3 font-medium">
                    Student
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Roll No.
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Class
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Present
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Absent
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Late
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Attendance
                  </th>

                </tr>
              </thead>

              <tbody>

                {data.student_reports.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b last:border-0"
                  >

                    <td className="px-4 py-4 font-medium">
                      {student.name}
                    </td>

                    <td className="px-4 py-4">
                      {student.roll_no}
                    </td>

                    <td className="px-4 py-4">
                      {student.class_name || "-"}
                      {student.division
                        ? ` - ${student.division}`
                        : ""}
                    </td>

                    <td className="px-4 py-4 text-success">
                      {student.present}
                    </td>

                    <td className="px-4 py-4 text-destructive">
                      {student.absent}
                    </td>

                    <td className="px-4 py-4 text-warning">
                      {student.late}
                    </td>

                    <td className="px-4 py-4">

                      <span
                        className={
                          student.below_75
                            ? "font-semibold text-destructive"
                            : "font-semibold text-success"
                        }
                      >
                        {student.attendance_percentage}%
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Report */}
      <Card>
        <CardHeader>
          <CardTitle>
            Subject-wise attendance
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">

                  <th className="px-4 py-3 font-medium">
                    Subject
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Lectures
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Present
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Absent
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Late
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Attendance
                  </th>

                </tr>
              </thead>

              <tbody>

                {data.subject_reports.map((subject) => (
                  <tr
                    key={subject.subject}
                    className="border-b last:border-0"
                  >

                    <td className="px-4 py-4 font-medium">
                      {subject.subject}
                    </td>

                    <td className="px-4 py-4">
                      {subject.lectures}
                    </td>

                    <td className="px-4 py-4 text-success">
                      {subject.present}
                    </td>

                    <td className="px-4 py-4 text-destructive">
                      {subject.absent}
                    </td>

                    <td className="px-4 py-4 text-warning">
                      {subject.late}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {subject.attendance_percentage}%
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </CardContent>
      </Card>

      {/* Below 75% */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-warning" />
            Students below 75%
          </CardTitle>
        </CardHeader>

        <CardContent>

          {data.below_75.length === 0 ? (

            <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
              No students are below 75%.
            </div>

          ) : (

            <div className="flex flex-col gap-3">

              {data.below_75.map((student) => (

                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >

                  <div>
                    <p className="font-medium">
                      {student.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Roll No. {student.roll_no}
                      {" • "}
                      {student.class_name || "No class"}
                    </p>
                  </div>

                  <div className="font-semibold text-destructive">
                    {student.attendance_percentage}%
                  </div>

                </div>

              ))}

            </div>

          )}

        </CardContent>
      </Card>

    </div>
  )
}