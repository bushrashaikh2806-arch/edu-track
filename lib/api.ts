/**
 * API service layer.
 *
 * Frontend data access is handled through FastAPI.
 * FastAPI -> Supabase PostgreSQL
 */

import type {
  Student,
  Staff,
  AttendanceRecord,
  ClassRoom,
  AppNotification,
} from "./types"

import {
  students as seedStudents,
  staff as seedStaff,
  classes as seedClasses,
  attendanceRecords as seedAttendance,
  notifications as seedNotifications,
} from "./mock-data"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000"
  const LATENCY = 350

function delay<T>(data: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(data), ms),
  )
}

// Mock stores for features that are not connected to backend yet.
let studentStore: Student[] = [...seedStudents]
let staffStore: Staff[] = [...seedStaff]
let attendanceStore: AttendanceRecord[] = [...seedAttendance]

const classStore: ClassRoom[] = [...seedClasses]

let notificationStore: AppNotification[] = [
  ...seedNotifications,
]


/* -------------------------------- Students ------------------------------- */

// Get all students from FastAPI
export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/students`)

  if (!response.ok) {
    throw new Error("Failed to fetch students")
  }

  const data = await response.json()

  return data.map((student: any) => ({
    id: student.id,
    studentId: student.id,
    fullName: student.name,
    rollNumber: student.roll_no,
    email: student.email ?? "",
    phone: "",
    dateOfBirth: "",
    gender: "other",
    className: student.class_name ?? "",
    division: student.division ?? "",
    academicYear: "",
    status: "active",
    enrollmentDate: student.created_at ?? "",
    attendancePercentage: 0,
  }))
}


// Get single student
export async function getStudent(
  id: string,
): Promise<Student | undefined> {
  // Backend endpoint can be used later.
  return delay(studentStore.find((s) => s.id === id))
}


// Create student
export async function createStudent(
  input: Omit<Student, "id" | "attendancePercentage">,
): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.fullName,
      roll_no: input.rollNumber,
      class_name: input.className,
      division: input.division,
      email: input.email,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create student")
  }

  const data = await response.json()
  const createdStudent = data[0]

  const student: Student = {
    id: createdStudent.id,
    studentId: createdStudent.id,
    fullName: createdStudent.name,
    rollNumber: createdStudent.roll_no,
    email: createdStudent.email ?? "",
    phone: input.phone,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    className: createdStudent.class_name ?? "",
    division: createdStudent.division ?? "",
    academicYear: input.academicYear,
    status: "active",
    enrollmentDate: createdStudent.created_at ?? "",
    attendancePercentage: 0,
  }

  return student
}


/* -------------------------------- Dashboard ------------------------------ */

// Present students today
export async function getPresentToday(): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/today/present`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch present attendance")
  }

  const data = await response.json()

  return data.count
}


// Absent students today
export async function getAbsentToday(): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/today/absent`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch absent attendance")
  }

  const data = await response.json()

  return data.count
}


// Average attendance
export async function getAverageAttendance(): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/average`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch average attendance")
  }

  const data = await response.json()

  return data.percentage
}


// Today's complete attendance summary
export async function getTodayAttendanceSummary(): Promise<{
  present: number
  late: number
  absent: number
  total: number
}> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/today-summary`,
  )

  if (!response.ok) {
    throw new Error(
      "Failed to fetch today's attendance summary",
    )
  }

  return response.json()
}


// Get real Classes page overview
export async function getClassesOverview() {
  const response = await fetch(
    `${API_BASE_URL}/classes/overview`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch classes overview")
  }

  return response.json()
}


/* -------------------------------- Lectures -------------------------------- */

// Get all lectures
export async function getLectures() {
  const response = await fetch(
    `${API_BASE_URL}/lectures`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch lectures")
  }

  return response.json()
}


/* ------------------------- Students For Lecture -------------------------- */

// This function is kept for future use.
// Attendance page should use getStudents()
// because all students must be displayed.
export async function getStudentsForLecture(
  lectureId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/lectures/${lectureId}/students`,
  )

  if (!response.ok) {
    throw new Error(
      "Failed to fetch students for lecture",
    )
  }

  const data = await response.json()

  return data.map((student: any) => ({
    id: student.id,
    studentId: student.id,
    fullName: student.name,
    rollNumber: student.roll_no,
    email: student.email ?? "",
    phone: "",
    dateOfBirth: "",
    gender: "other",
    className: student.class_name ?? "",
    division: student.division ?? "",
    academicYear: "",
    status: "active",
    enrollmentDate: student.created_at ?? "",
    attendancePercentage: 0,
  }))
}


/* --------------------------- Attendance Saving --------------------------- */

// Save attendance for all students of a lecture
export async function saveBulkAttendance(
  lectureId: string,
  attendance: {
    student_id: string
    status: "present" | "absent" | "late"
  }[],
) {
  const response = await fetch(
    `${API_BASE_URL}/attendance/bulk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lecture_id: lectureId,
        attendance,
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to save attendance")
  }

  return response.json()
}


/* --------------------------------- Staff --------------------------------- */

// Get teachers/staff from FastAPI
export async function getStaff(): Promise<Staff[]> {
  const response = await fetch(
    `${API_BASE_URL}/teachers`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch staff")
  }

  const data = await response.json()

  return data.map((teacher: any) => ({
    id: teacher.id,
    staffId: teacher.employee_id ?? "",
    fullName: teacher.name,
    email: teacher.email ?? "",
    phone: teacher.phone ?? "",
    department: "",
    designation: teacher.role ?? "Teacher",

    role:
      teacher.role?.toLowerCase() === "administrator"
        ? "Administrator"
        : teacher.role?.toLowerCase() === "coordinator"
          ? "Coordinator"
          : "Teacher",

    status: "active",
  }))
}


// Create staff
export async function createStaff(
  input: {
    fullName: string
    staffId: string
    email: string
    phone: string
    role:
      | "Administrator"
      | "Teacher"
      | "Coordinator"
  },
): Promise<Staff> {
  const response = await fetch(
    `${API_BASE_URL}/teachers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.fullName,
        employee_id: input.staffId,
        email: input.email,
        phone: input.phone,
        role: input.role,
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to create staff")
  }

  const data = await response.json()
  const teacher = data[0]

  return {
    id: teacher.id,
    staffId: teacher.employee_id ?? "",
    fullName: teacher.name,
    email: teacher.email ?? "",
    phone: teacher.phone ?? "",
    department: "",
    designation: teacher.role ?? "Teacher",

    role:
      teacher.role?.toLowerCase() === "administrator"
        ? "Administrator"
        : teacher.role?.toLowerCase() === "coordinator"
          ? "Coordinator"
          : "Teacher",

    status: "active",
  }
}


// Update staff
export async function updateStaff(
  id: string,
  input: Partial<Omit<Staff, "id">>,
): Promise<Staff> {
  const response = await fetch(
    `${API_BASE_URL}/teachers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(input.fullName !== undefined && {
          name: input.fullName,
        }),

        ...(input.staffId !== undefined && {
          employee_id: input.staffId,
        }),

        ...(input.email !== undefined && {
          email: input.email,
        }),

        ...(input.phone !== undefined && {
          phone: input.phone,
        }),

        ...(input.role !== undefined && {
          role: input.role,
        }),
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to update staff")
  }

  const teacher = await response.json()

  return {
    id: teacher.id,
    staffId: teacher.employee_id ?? "",
    fullName: teacher.name,
    email: teacher.email ?? "",
    phone: teacher.phone ?? "",
    department: "",
    designation: teacher.role ?? "Teacher",

    role:
      teacher.role?.toLowerCase() === "administrator"
        ? "Administrator"
        : teacher.role?.toLowerCase() === "coordinator"
          ? "Coordinator"
          : "Teacher",

    status: "active",
  }
}


// Delete staff
export async function deleteStaff(
  id: string,
): Promise<{ id: string }> {
  const response = await fetch(
    `${API_BASE_URL}/teachers/${id}`,
    {
      method: "DELETE",
    },
  )

  if (!response.ok) {
    throw new Error("Failed to delete staff")
  }

  return { id }
}


/* ------------------------------- Attendance ------------------------------ */

// Old/mock attendance functions
// Kept so other existing pages don't break.

export async function getAttendance(): Promise<
  AttendanceRecord[]
> {
  return delay([...attendanceStore])
}


export async function saveAttendance(
  records: AttendanceRecord[],
): Promise<AttendanceRecord[]> {
  attendanceStore = [
    ...records,
    ...attendanceStore,
  ]

  return delay(records)
}


export async function updateAttendance(
  id: string,
  input: Partial<AttendanceRecord>,
): Promise<AttendanceRecord> {
  attendanceStore = attendanceStore.map((a) =>
    a.id === id
      ? {
          ...a,
          ...input,
        }
      : a,
  )

  return delay(
    attendanceStore.find((a) => a.id === id)!,
  )
}


export async function getClassStudents(
  className: string,
  division: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/classes/students?class_name=${encodeURIComponent(
      className,
    )}&division=${encodeURIComponent(division)}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch class students")
  }

  return response.json()
}


/* ----------------------------- Notifications ----------------------------- */

export async function getNotifications(): Promise<
  AppNotification[]
> {
  return delay(
    [...notificationStore],
    150,
  )
}


export async function markNotificationsRead(): Promise<
  AppNotification[]
> {
  notificationStore = notificationStore.map((n) => ({
    ...n,
    read: true,
  }))

  return delay(
    [...notificationStore],
    100,
  )
}


/* -------------------------------- Reports -------------------------------- */

export async function getReportsOverview() {
  const response = await fetch(
    `${API_BASE_URL}/reports/overview`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch reports")
  }

  return response.json()
}