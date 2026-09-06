import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  BookOpen,
  FileBarChart,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
  },
  {
    label: "Staff",
    href: "/staff",
    icon: UserCog,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Classes",
    href: "/classes",
    icon: BookOpen,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
]

export function titleForPath(pathname: string): string {
  if (pathname.startsWith("/students")) return "Students"
  if (pathname.startsWith("/staff")) return "Staff"
  if (pathname.startsWith("/attendance/history")) {
    return "Attendance History"
  }
  if (pathname.startsWith("/attendance")) return "Attendance"
  if (pathname.startsWith("/classes")) return "Classes"
  if (pathname.startsWith("/reports")) return "Reports"

  return "Dashboard"
}