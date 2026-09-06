export type AttendanceStatus = "present" | "absent" | "late"

export type EntityStatus = "active" | "inactive"

export interface Student {
  id: string
  studentId: string
  fullName: string
  rollNumber: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  className: string
  division: string
  academicYear: string
  status: EntityStatus
  enrollmentDate: string
  attendancePercentage: number
  avatarUrl?: string
}

export interface Staff {
  id: string
  staffId: string
  fullName: string
  email: string
  phone: string
  department: string
  designation: string
  role: "Administrator" | "Teacher" | "Coordinator"
  status: EntityStatus
  avatarUrl?: string
}

export interface ClassRoom {
  id: string
  className: string
  division: string
  studentCount: number
  teacher: string
  attendancePercentage: number
  academicYear: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  className: string
  division: string
  date: string
  status: AttendanceStatus
  time: string | null
  markedBy: string
}

export interface DailyAttendancePoint {
  label: string
  present: number
  absent: number
  late: number
}

export interface AppNotification {
  id: string
  title: string
  description: string
  time: string
  type: "info" | "success" | "warning"
  read: boolean
}
