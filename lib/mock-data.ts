import type {
  Student,
  Staff,
  ClassRoom,
  AttendanceRecord,
  DailyAttendancePoint,
  AppNotification,
  AttendanceStatus,
} from "./types"

export const CLASSES = [
  "FYBCA",
  "SYBCA",
  "TYBCA",
  "FYBCom",
  "SYBCom",
  "TYBCom",
  "FYDS",
  "SYDS",
  "TYDS",
]
export const DIVISIONS = ["A", "B", "C"]
export const ACADEMIC_YEARS = ["2025-26", "2024-25", "2023-24"]
export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Commerce",
  "Administration",
]

const FIRST_NAMES = [
  "Aisha", "Bushra", "Sana", "Zara", "Fatima", "Rahul", "Arjun", "Priya",
  "Neha", "Karan", "Ananya", "Rohan", "Isha", "Aditya", "Meera", "Vikram",
  "Sneha", "Aryan", "Diya", "Kabir", "Riya", "Yash", "Tanvi", "Omar",
  "Hina", "Farhan", "Nikita", "Sameer", "Pooja", "Imran",
]

const LAST_NAMES = [
  "Khan", "Shaikh", "Patel", "Sharma", "Verma", "Iyer", "Nair", "Gupta",
  "Reddy", "Desai", "Joshi", "Mehta", "Kapoor", "Rao", "Ansari", "Malik",
]

const TEACHERS = [
  "Prof. Ahmed", "Dr. Nalini Rao", "Prof. Sunita Menon", "Dr. Rajesh Kumar",
  "Prof. Fatima Sheikh",
]

function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const rand = seededRandom(42)

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function pad(n: number, len = 3) {
  return n.toString().padStart(len, "0")
}

export const students: Student[] = Array.from({ length: 48 }).map((_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = pick(LAST_NAMES)
  const fullName = `${first} ${last}`
  const className = CLASSES[i % CLASSES.length]
  const division = DIVISIONS[i % DIVISIONS.length]
  const attendance = Math.round((68 + rand() * 31) * 10) / 10
  return {
    id: `stu-${pad(i + 1)}`,
    studentId: `EDU${pad(1000 + i + 1, 4)}`,
    fullName,
    rollNumber: `${101 + i}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    phone: `+91 98${pad(Math.floor(rand() * 100000000), 8)}`,
    dateOfBirth: `200${3 + (i % 4)}-0${1 + (i % 9)}-1${i % 9}`,
    gender: i % 3 === 0 ? "male" : "female",
    className,
    division,
    academicYear: "2025-26",
    status: i % 11 === 0 ? "inactive" : "active",
    enrollmentDate: `2023-06-${pad(1 + (i % 27), 2)}`,
    attendancePercentage: attendance,
  }
})

export const staff: Staff[] = [
  {
    id: "stf-001",
    staffId: "STF001",
    fullName: "Prof. Ahmed Raza",
    email: "ahmed.raza@edutrack.edu",
    phone: "+91 9876543210",
    department: "Computer Science",
    designation: "Associate Professor",
    role: "Teacher",
    status: "active",
  },
  {
    id: "stf-002",
    staffId: "STF002",
    fullName: "Dr. Nalini Rao",
    email: "nalini.rao@edutrack.edu",
    phone: "+91 9876543211",
    department: "Mathematics",
    designation: "Head of Department",
    role: "Coordinator",
    status: "active",
  },
  {
    id: "stf-003",
    staffId: "STF003",
    fullName: "Prof. Sunita Menon",
    email: "sunita.menon@edutrack.edu",
    phone: "+91 9876543212",
    department: "Physics",
    designation: "Assistant Professor",
    role: "Teacher",
    status: "active",
  },
  {
    id: "stf-004",
    staffId: "STF004",
    fullName: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@edutrack.edu",
    phone: "+91 9876543213",
    department: "Commerce",
    designation: "Professor",
    role: "Teacher",
    status: "active",
  },
  {
    id: "stf-005",
    staffId: "STF005",
    fullName: "Fatima Sheikh",
    email: "fatima.sheikh@edutrack.edu",
    phone: "+91 9876543214",
    department: "Administration",
    designation: "Administrator",
    role: "Administrator",
    status: "active",
  },
  {
    id: "stf-006",
    staffId: "STF006",
    fullName: "Prof. Vikram Desai",
    email: "vikram.desai@edutrack.edu",
    phone: "+91 9876543215",
    department: "Computer Science",
    designation: "Lecturer",
    role: "Teacher",
    status: "inactive",
  },
]

export const classes: ClassRoom[] = CLASSES.flatMap((className, ci) =>
  DIVISIONS.map((division, di) => {
    const studentCount = students.filter(
      (s) => s.className === className && s.division === division,
    ).length
    return {
      id: `cls-${ci}-${di}`,
      className,
      division,
      studentCount: studentCount || 40 + ((ci + di) % 25),
      teacher: TEACHERS[(ci + di) % TEACHERS.length],
      attendancePercentage: Math.round((84 + rand() * 12) * 10) / 10,
      academicYear: "2025-26",
    }
  }),
)

const STATUSES: AttendanceStatus[] = ["present", "absent", "late"]

export const attendanceRecords: AttendanceRecord[] = students
  .slice(0, 24)
  .flatMap((student, si) =>
    Array.from({ length: 5 }).map((_, di) => {
      const roll = rand()
      const status: AttendanceStatus =
        roll > 0.82 ? "absent" : roll > 0.72 ? "late" : "present"
      const day = 3 - di
      return {
        id: `att-${student.id}-${di}`,
        studentId: student.id,
        studentName: student.fullName,
        rollNumber: student.rollNumber,
        className: student.className,
        division: student.division,
        date: `2026-09-0${day > 0 ? day : 1}`,
        status,
        time: status === "absent" ? null : `9:0${(si % 5) + 1} AM`,
        markedBy: "Admin",
      }
    }),
  )

export const todayAttendance: AttendanceRecord[] = students
  .slice(0, 8)
  .map((student, i) => {
    const roll = (i * 37) % 100
    const status: AttendanceStatus =
      roll > 82 ? "absent" : roll > 70 ? "late" : "present"
    return {
      id: `today-${student.id}`,
      studentId: student.id,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      className: student.className,
      division: student.division,
      date: "2026-09-03",
      status,
      time: status === "absent" ? null : `9:0${(i % 6) + 1} AM`,
      markedBy: "Admin",
    }
  })

export const weeklyTrend: DailyAttendancePoint[] = [
  { label: "Mon", present: 1180, absent: 68, late: 34 },
  { label: "Tue", present: 1204, absent: 44, late: 22 },
  { label: "Wed", present: 1126, absent: 122, late: 41 },
  { label: "Thu", present: 1198, absent: 50, late: 28 },
  { label: "Fri", present: 1156, absent: 92, late: 37 },
  { label: "Sat", present: 1090, absent: 158, late: 45 },
]

export const monthlyTrend: DailyAttendancePoint[] = [
  { label: "Week 1", present: 5820, absent: 380, late: 190 },
  { label: "Week 2", present: 5960, absent: 300, late: 160 },
  { label: "Week 3", present: 5710, absent: 470, late: 210 },
  { label: "Week 4", present: 6010, absent: 260, late: 140 },
]

export const semesterTrend: DailyAttendancePoint[] = [
  { label: "Jun", present: 24800, absent: 1600, late: 820 },
  { label: "Jul", present: 25600, absent: 1200, late: 640 },
  { label: "Aug", present: 24100, absent: 2100, late: 910 },
  { label: "Sep", present: 12400, absent: 720, late: 380 },
]

export const notifications: AppNotification[] = [
  {
    id: "ntf-1",
    title: "Low attendance alert",
    description: "5 students have attendance below 75%.",
    time: "10 min ago",
    type: "warning",
    read: false,
  },
  {
    id: "ntf-2",
    title: "Attendance saved",
    description: "Today's attendance has been successfully saved.",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: "ntf-3",
    title: "New staff member added",
    description: "Prof. Vikram Desai was added to Computer Science.",
    time: "3 hours ago",
    type: "info",
    read: false,
  },
  {
    id: "ntf-4",
    title: "Report generated",
    description: "Monthly attendance report for August is ready.",
    time: "Yesterday",
    type: "info",
    read: true,
  },
]

export const dashboardStats = {
  totalStudents: 1248,
  presentToday: 1126,
  absentToday: 122,
  averageAttendance: 90.2,
  trends: {
    totalStudents: 3.2,
    presentToday: 1.8,
    absentToday: -0.9,
    averageAttendance: 1.4,
  },
}
