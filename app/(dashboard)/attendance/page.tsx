"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Check,
  Clock,
  UserX,
  User,
  BookOpen,
  GraduationCap,
} from "lucide-react"

import {
  getLectures,
  getStudents,
  getStaff,
  saveBulkAttendance,
} from "@/lib/api"

import type { Student, Staff } from "@/lib/types"

type AttendanceStatus =
  | "present"
  | "absent"
  | "late"

type AttendanceState =
  Record<string, AttendanceStatus>

type Lecture = {
  id: string
  teacher_id: string
  subject_name: string
  class_name: string
  division: string | null
  lecture_title: string
  lecture_date: string
  start_time: string | null
  end_time: string | null
  notes: string | null
  material_url: string | null
}

export default function AttendancePage() {

  // --------------------------------
  // STATES
  // --------------------------------

  const [students, setStudents] =
    useState<Student[]>([])

  const [lectures, setLectures] =
    useState<Lecture[]>([])

  const [staff, setStaff] =
    useState<Staff[]>([])

  const [selectedTeacher, setSelectedTeacher] =
    useState("")

  const [selectedSubject, setSelectedSubject] =
    useState("")

  const [selectedClass, setSelectedClass] =
    useState("")

  const [selectedLecture, setSelectedLecture] =
    useState("")

  const [attendance, setAttendance] =
    useState<AttendanceState>({})

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState("")


  // --------------------------------
  // LOAD ALL DATA
  // --------------------------------

  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true)

        const [
          lectureData,
          studentData,
          staffData,
        ] = await Promise.all([
          getLectures(),
          getStudents(),
          getStaff(),
        ])

        setLectures(lectureData)
        setStudents(studentData)
        setStaff(staffData)

        // Default attendance = absent
        const initialAttendance:
          AttendanceState = {}

        studentData.forEach((student) => {

          initialAttendance[
            student.id
          ] = "absent"

        })

        setAttendance(
          initialAttendance
        )

        // Automatically select first lecture
        if (lectureData.length > 0) {

          const firstLecture =
            lectureData[0]

          setSelectedTeacher(
            firstLecture.teacher_id
          )

          setSelectedSubject(
            firstLecture.subject_name
          )

          setSelectedClass(
            `${firstLecture.class_name}${
              firstLecture.division
                ? ` - ${firstLecture.division}`
                : ""
            }`
          )

          setSelectedLecture(
            firstLecture.id
          )
        }

      } catch (error) {

        console.error(error)

        setMessage(
          "Failed to load attendance data."
        )

      } finally {

        setLoading(false)

      }

    }

    loadData()

  }, [])


  // --------------------------------
  // TEACHERS
  // --------------------------------

  const teachers = useMemo(() => {

    const teacherIds =
      Array.from(
        new Set(
          lectures.map(
            (lecture) =>
              lecture.teacher_id
          )
        )
      )

    return teacherIds.map((id) => {

      const teacher =
        staff.find(
          (member) =>
            member.id === id
        )

      return {
        id,
        name:
          teacher?.fullName ??
          "Unknown Teacher",
      }

    })

  }, [lectures, staff])


  // --------------------------------
  // SUBJECTS
  // --------------------------------

  const subjects = useMemo(() => {

    return Array.from(
      new Set(
        lectures
          .filter(
            (lecture) =>
              lecture.teacher_id ===
              selectedTeacher
          )
          .map(
            (lecture) =>
              lecture.subject_name
          )
      )
    )

  }, [
    lectures,
    selectedTeacher,
  ])


  // --------------------------------
  // CLASSES
  // --------------------------------

  const classes = useMemo(() => {

    return Array.from(
      new Set(
        lectures
          .filter(
            (lecture) =>
              lecture.teacher_id ===
                selectedTeacher &&
              lecture.subject_name ===
                selectedSubject
          )
          .map((lecture) => {

            return `${lecture.class_name}${
              lecture.division
                ? ` - ${lecture.division}`
                : ""
            }`

          })
      )
    )

  }, [
    lectures,
    selectedTeacher,
    selectedSubject,
  ])


  // --------------------------------
  // FILTER LECTURES
  // --------------------------------

  const filteredLectures =
    useMemo(() => {

      return lectures.filter(
        (lecture) => {

          const lectureClass =
            `${lecture.class_name}${
              lecture.division
                ? ` - ${lecture.division}`
                : ""
            }`

          return (
            lecture.teacher_id ===
              selectedTeacher &&
            lecture.subject_name ===
              selectedSubject &&
            lectureClass ===
              selectedClass
          )

        }
      )

    }, [
      lectures,
      selectedTeacher,
      selectedSubject,
      selectedClass,
    ])


  // --------------------------------
  // TEACHER CHANGE
  // --------------------------------

  function handleTeacherChange(
    teacherId: string
  ) {

    setSelectedTeacher(
      teacherId
    )

    setSelectedSubject("")
    setSelectedClass("")
    setSelectedLecture("")

    setMessage("")

  }


  // --------------------------------
  // SUBJECT CHANGE
  // --------------------------------

  function handleSubjectChange(
    subject: string
  ) {

    setSelectedSubject(
      subject
    )

    setSelectedClass("")
    setSelectedLecture("")

    setMessage("")

  }


  // --------------------------------
  // CLASS CHANGE
  // --------------------------------

  function handleClassChange(
    className: string
  ) {

    setSelectedClass(
      className
    )

    setSelectedLecture("")

    setMessage("")

  }


  // --------------------------------
  // LECTURE CHANGE
  // --------------------------------

  function handleLectureChange(
    lectureId: string
  ) {

    setSelectedLecture(
      lectureId
    )

    setMessage("")

  }


  // --------------------------------
  // MARK ATTENDANCE
  // --------------------------------

  function markStatus(
    studentId: string,
    status: AttendanceStatus
  ) {

    setAttendance(
      (current) => ({
        ...current,
        [studentId]: status,
      })
    )

  }


  // --------------------------------
  // SAVE ATTENDANCE
  // --------------------------------

  async function saveAttendance() {

    if (!selectedLecture) {

      setMessage(
        "Please select a lecture first."
      )

      return
    }

    if (students.length === 0) {

      setMessage(
        "No students found."
      )

      return
    }

    setSaving(true)
    setMessage("")

    try {

      const records =
        students.map(
          (student) => ({
            student_id:
              student.id,

            status:
              attendance[
                student.id
              ] ?? "absent",
          })
        )

      await saveBulkAttendance(
        selectedLecture,
        records
      )

      setMessage(
        "Attendance saved successfully! ✅"
      )

    } catch (error) {

      console.error(error)

      setMessage(
        "Failed to save attendance."
      )

    } finally {

      setSaving(false)

    }

  }


  // --------------------------------
  // COUNTS
  // --------------------------------

  const presentCount =
    Object.values(
      attendance
    ).filter(
      (status) =>
        status === "present"
    ).length

  const absentCount =
    Object.values(
      attendance
    ).filter(
      (status) =>
        status === "absent"
    ).length

  const lateCount =
    Object.values(
      attendance
    ).filter(
      (status) =>
        status === "late"
    ).length


  // --------------------------------
  // CURRENT LECTURE
  // --------------------------------

  const currentLecture =
    lectures.find(
      (lecture) =>
        lecture.id ===
        selectedLecture
    )


  // --------------------------------
  // CURRENT TEACHER
  // --------------------------------

  const currentTeacher =
    staff.find(
      (member) =>
        member.id ===
        currentLecture?.teacher_id
    )


  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {

    return (
      <div className="flex items-center justify-center py-20">

        <p className="text-muted-foreground">
          Loading attendance...
        </p>

      </div>
    )

  }


  // --------------------------------
  // UI
  // --------------------------------

  return (

    <div className="flex flex-col gap-6">


      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Attendance
        </h2>

        <p className="text-sm text-muted-foreground">
          Mark and manage student attendance.
        </p>

      </div>


      {/* SELECT LECTURE DETAILS */}

      <div className="rounded-xl border bg-card p-5">

        <div className="mb-5">

          <h3 className="font-semibold">
            Select Lecture Details
          </h3>

          <p className="text-sm text-muted-foreground">
            Select teacher, subject, class and lecture.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          {/* TEACHER */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium">

              <User className="size-4" />

              Teacher

            </label>


            <select
              value={selectedTeacher}
              onChange={(e) =>
                handleTeacherChange(
                  e.target.value
                )
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >

              <option value="">
                Select teacher
              </option>


              {teachers.map(
                (teacher) => (

                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* SUBJECT */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium">

              <BookOpen className="size-4" />

              Subject

            </label>


            <select
              value={selectedSubject}
              onChange={(e) =>
                handleSubjectChange(
                  e.target.value
                )
              }
              disabled={!selectedTeacher}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
            >

              <option value="">
                Select subject
              </option>


              {subjects.map(
                (subject) => (

                  <option
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </option>

                )
              )}

            </select>

          </div>


          {/* CLASS */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium">

              <GraduationCap className="size-4" />

              Class

            </label>


            <select
              value={selectedClass}
              onChange={(e) =>
                handleClassChange(
                  e.target.value
                )
              }
              disabled={!selectedSubject}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
            >

              <option value="">
                Select class
              </option>


              {classes.map(
                (className) => (

                  <option
                    key={className}
                    value={className}
                  >
                    {className}
                  </option>

                )
              )}

            </select>

          </div>


          {/* LECTURE */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium">

              <BookOpen className="size-4" />

              Lecture

            </label>


            <select
              value={selectedLecture}
              onChange={(e) =>
                handleLectureChange(
                  e.target.value
                )
              }
              disabled={!selectedClass}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
            >

              <option value="">
                Select lecture
              </option>


              {filteredLectures.map(
                (lecture) => (

                  <option
                    key={lecture.id}
                    value={lecture.id}
                  >

                    {lecture.lecture_title}
                    {" — "}
                    {lecture.lecture_date}

                  </option>

                )
              )}

            </select>

          </div>

        </div>

      </div>


      {/* LECTURE DETAILS */}

      {currentLecture && (

        <div className="rounded-xl border bg-card p-5">

          <h3 className="mb-4 font-semibold">
            Lecture Details
          </h3>


          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">


            <div>

              <p className="text-muted-foreground">
                Teacher
              </p>

              <p className="font-medium">
                {currentTeacher?.fullName ??
                  "Unknown Teacher"}
              </p>

            </div>


            <div>

              <p className="text-muted-foreground">
                Subject
              </p>

              <p className="font-medium">
                {currentLecture.subject_name}
              </p>

            </div>


            <div>

              <p className="text-muted-foreground">
                Lecture
              </p>

              <p className="font-medium">
                {currentLecture.lecture_title}
              </p>

            </div>


            <div>

              <p className="text-muted-foreground">
                Class
              </p>

              <p className="font-medium">
                {currentLecture.class_name}

                {currentLecture.division
                  ? ` - ${currentLecture.division}`
                  : ""}
              </p>

            </div>


            <div>

              <p className="text-muted-foreground">
                Date
              </p>

              <p className="font-medium">
                {currentLecture.lecture_date}
              </p>

            </div>


            <div>

              <p className="text-muted-foreground">
                Time
              </p>

              <p className="font-medium">

                {currentLecture.start_time ??
                  "--"}

                {" - "}

                {currentLecture.end_time ??
                  "--"}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* ATTENDANCE SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


        {/* PRESENT */}

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
                {presentCount}
              </p>

            </div>

          </div>

        </div>


        {/* LATE */}

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
                {lateCount}
              </p>

            </div>

          </div>

        </div>


        {/* ABSENT */}

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
                {absentCount}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* STUDENT ATTENDANCE */}

      <div className="rounded-xl border bg-card">


        {/* TOP */}

        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="font-semibold">
              Student Attendance
            </h3>

            <p className="text-sm text-muted-foreground">
              {students.length} students
            </p>

          </div>


          <button
            type="button"
            onClick={saveAttendance}
            disabled={
              saving ||
              students.length === 0 ||
              !selectedLecture
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving
              ? "Saving..."
              : "Save Attendance"}

          </button>

        </div>


        {/* MESSAGE */}

        {message && (

          <div className="border-b px-5 py-3 text-sm text-muted-foreground">

            {message}

          </div>

        )}


        {/* STUDENTS */}

        {students.length === 0 ? (

          <div className="flex items-center justify-center py-10">

            <p className="text-sm text-muted-foreground">
              No students found.
            </p>

          </div>

        ) : (

          <div className="divide-y">

            {students.map(
              (student) => {

                const status =
                  attendance[
                    student.id
                  ]

                return (

                  <div
                    key={student.id}
                    className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                  >


                    {/* STUDENT INFO */}

                    <div>

                      <p className="font-medium">
                        {student.fullName}
                      </p>

                      <p className="text-sm text-muted-foreground">

                        Roll{" "}
                        {student.rollNumber}

                        {" · "}

                        {student.className}

                        {" · "}

                        {student.division}

                      </p>

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-2">


                      {/* PRESENT */}

                      <button
                        type="button"
                        onClick={() =>
                          markStatus(
                            student.id,
                            "present"
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          status === "present"
                            ? "bg-success text-success-foreground"
                            : "border bg-background hover:bg-muted"
                        }`}
                      >
                        Present
                      </button>


                      {/* LATE */}

                      <button
                        type="button"
                        onClick={() =>
                          markStatus(
                            student.id,
                            "late"
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          status === "late"
                            ? "bg-warning text-warning-foreground"
                            : "border bg-background hover:bg-muted"
                        }`}
                      >
                        Late
                      </button>


                      {/* ABSENT */}

                      <button
                        type="button"
                        onClick={() =>
                          markStatus(
                            student.id,
                            "absent"
                          )
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          status === "absent"
                            ? "bg-destructive text-destructive-foreground"
                            : "border bg-background hover:bg-muted"
                        }`}
                      >
                        Absent
                      </button>

                    </div>

                  </div>

                )

              }
            )}

          </div>

        )}

      </div>

    </div>
  )
}