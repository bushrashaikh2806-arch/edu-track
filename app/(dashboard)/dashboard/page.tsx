"use client"

import { useEffect, useState } from "react"

import {
  getStudents,
  getPresentToday,
  getAbsentToday,
  getAverageAttendance,
  getTodayAttendanceSummary,
} from "@/lib/api"

import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Bell,
  ChevronRight,
  CalendarDays,
  Send,
  Trash2,
} from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { TodayAttendance } from "@/components/dashboard/today-attendance"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { dashboardStats } from "@/lib/mock-data"

type Notice = {
  id: number
  title: string
  description: string
  category: "Academic" | "Event" | "General"
  date: string
}

const defaultNotices: Notice[] = [
  {
    id: 1,
    title: "Welcome to EduTrack",
    description:
      "Important college announcements and updates will appear here.",
    category: "General",
    date: "Today",
  },
]

export default function DashboardPage() {
  const [totalStudents, setTotalStudents] = useState(0)
  const [presentToday, setPresentToday] = useState(0)
  const [absentToday, setAbsentToday] = useState(0)
  const [lateToday, setLateToday] = useState(0)
  const [averageAttendance, setAverageAttendance] = useState(0)

  const [notices, setNotices] = useState<Notice[]>([])
  const [noticeTitle, setNoticeTitle] = useState("")
  const [noticeDescription, setNoticeDescription] = useState("")
  const [noticeCategory, setNoticeCategory] =
    useState<Notice["category"]>("General")

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          students,
          present,
          absent,
          average,
          todaySummary,
        ] = await Promise.all([
          getStudents(),
          getPresentToday(),
          getAbsentToday(),
          getAverageAttendance(),
          getTodayAttendanceSummary(),
        ])

        setTotalStudents(students.length)
        setPresentToday(present)
        setAbsentToday(absent)
        setAverageAttendance(average)
        setLateToday(todaySummary.late)
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error,
        )
      }
    }

    loadDashboardData()
  }, [])

  // Load notices from browser storage
  useEffect(() => {
    const savedNotices = localStorage.getItem(
      "edutrack-notices",
    )

    if (savedNotices) {
      try {
        setNotices(JSON.parse(savedNotices))
      } catch {
        setNotices(defaultNotices)
      }
    } else {
      setNotices(defaultNotices)
    }
  }, [])

  // Save notices whenever they change
  useEffect(() => {
    if (notices.length > 0) {
      localStorage.setItem(
        "edutrack-notices",
        JSON.stringify(notices),
      )
    }
  }, [notices])

  const handlePostNotice = () => {
    if (
      !noticeTitle.trim() ||
      !noticeDescription.trim()
    ) {
      return
    }

    const newNotice: Notice = {
      id: Date.now(),
      title: noticeTitle.trim(),
      description: noticeDescription.trim(),
      category: noticeCategory,
      date: "Today",
    }

    setNotices((current) => [
      newNotice,
      ...current,
    ])

    setNoticeTitle("")
    setNoticeDescription("")
    setNoticeCategory("General")
  }

  const handleDeleteNotice = (id: number) => {
    setNotices((current) =>
      current.filter(
        (notice) => notice.id !== id,
      ),
    )
  }

  const { trends } = dashboardStats

  const breakdown = [
    {
      label: "Present",
      value: presentToday,
      total: totalStudents,
      color: "bg-success",
    },
    {
      label: "Late",
      value: lateToday,
      total: totalStudents,
      color: "bg-warning",
    },
    {
      label: "Absent",
      value: absentToday,
      total: totalStudents,
      color: "bg-destructive",
    },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Good morning, Admin
        </h2>

        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your institution today.
        </p>
      </div>


      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total students"
          value={totalStudents.toLocaleString()}
          hint="Enrolled this academic year"
          trend={trends.totalStudents}
          icon={Users}
          tone="primary"
        />

        <StatCard
          label="Present today"
          value={presentToday.toLocaleString()}
          hint="Attendance marked today"
          trend={trends.presentToday}
          icon={UserCheck}
          tone="success"
        />

        <StatCard
          label="Absent today"
          value={absentToday.toLocaleString()}
          hint="Marked absent today"
          trend={trends.absentToday}
          icon={UserX}
          tone="destructive"
        />

        <StatCard
          label="Average attendance"
          value={`${averageAttendance}%`}
          hint="Based on recorded attendance"
          trend={trends.averageAttendance}
          icon={TrendingUp}
          tone="warning"
        />

      </div>


      {/* NOTICE BOARD + TODAY AT A GLANCE */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


        {/* NOTICE BOARD */}
        <Card className="xl:col-span-2">

          <CardHeader className="border-b pb-4">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="size-5 text-primary" />
              </div>

              <div>
                <CardTitle>
                  Notice Board
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Create and share important announcements
                </p>
              </div>

            </div>

          </CardHeader>


          <CardContent className="p-5">

            {/* CREATE NOTICE */}
            <div className="mb-6 rounded-xl border bg-muted/20 p-4">

              <div className="mb-4">
                <p className="text-sm font-semibold">
                  Create a notice
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Write an announcement for students and staff.
                </p>
              </div>


              <div className="flex flex-col gap-3">

                {/* TITLE */}
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) =>
                    setNoticeTitle(e.target.value)
                  }
                  placeholder="Notice title"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                />


                {/* MESSAGE */}
                <textarea
                  value={noticeDescription}
                  onChange={(e) =>
                    setNoticeDescription(
                      e.target.value,
                    )
                  }
                  placeholder="Write your notice here..."
                  rows={3}
                  className="resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                />


                {/* CATEGORY + BUTTON */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <select
                    value={noticeCategory}
                    onChange={(e) =>
                      setNoticeCategory(
                        e.target.value as Notice["category"],
                      )
                    }
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="General">
                      General
                    </option>

                    <option value="Academic">
                      Academic
                    </option>

                    <option value="Event">
                      Event
                    </option>
                  </select>


                  <button
                    type="button"
                    onClick={handlePostNotice}
                    disabled={
                      !noticeTitle.trim() ||
                      !noticeDescription.trim()
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="size-4" />
                    Post Notice
                  </button>

                </div>

              </div>

            </div>


            {/* NOTICE LIST */}
            <div className="divide-y rounded-xl border">

              {notices.length === 0 ? (

                <div className="flex flex-col items-center justify-center px-5 py-10 text-center">

                  <Bell className="mb-3 size-8 text-muted-foreground/50" />

                  <p className="text-sm font-medium">
                    No notices yet
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Create your first notice above.
                  </p>

                </div>

              ) : (

                notices.map((notice) => (

                  <div
                    key={notice.id}
                    className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30"
                  >

                    {/* DATE */}
                    <div className="hidden shrink-0 flex-col items-center justify-center rounded-xl bg-muted/60 px-3 py-2 sm:flex">

                      <CalendarDays className="mb-1 size-4 text-muted-foreground" />

                      <span className="text-[10px] font-medium text-muted-foreground">
                        {notice.date}
                      </span>

                    </div>


                    {/* NOTICE CONTENT */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-1 flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            notice.category === "Academic"
                              ? "bg-primary/10 text-primary"
                              : notice.category === "Event"
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {notice.category}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {notice.date}
                        </span>

                      </div>


                      <h3 className="text-sm font-semibold">
                        {notice.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {notice.description}
                      </p>

                    </div>


                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteNotice(
                          notice.id,
                        )
                      }
                      aria-label="Delete notice"
                      className="rounded-lg p-2 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>


                    <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground/50" />

                  </div>

                ))

              )}

            </div>

          </CardContent>

        </Card>


        {/* TODAY AT A GLANCE */}
        <Card className="h-full">

          <CardHeader className="border-b pb-4">
            <CardTitle>
              Today at a glance
            </CardTitle>
          </CardHeader>


          <CardContent className="flex flex-col gap-5">

            {breakdown.map((b) => {

              const pct =
                b.total > 0
                  ? Math.round(
                      (b.value / b.total) * 100,
                    )
                  : 0

              return (

                <div
                  key={b.label}
                  className="flex flex-col gap-2"
                >

                  <div className="flex items-center justify-between text-sm">

                    <span className="flex items-center gap-2 font-medium">

                      <span
                        className={`size-2 rounded-full ${b.color}`}
                      />

                      {b.label}

                    </span>


                    <span className="tabular-nums text-muted-foreground">
                      {b.value.toLocaleString()} · {pct}%
                    </span>

                  </div>


                  <Progress value={pct} />

                </div>

              )
            })}


            <div className="mt-1 rounded-xl bg-muted/50 p-4">

              <p className="text-sm font-medium">
                Attendance target
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Institution minimum is 75%.
              </p>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* TODAY'S ATTENDANCE */}
      <TodayAttendance />

    </div>
  )
}