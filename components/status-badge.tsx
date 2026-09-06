import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AttendanceStatus, EntityStatus } from "@/lib/types"

const attendanceStyles: Record<AttendanceStatus, string> = {
  present: "bg-success/12 text-success",
  late: "bg-warning/15 text-warning-foreground",
  absent: "bg-destructive/12 text-destructive",
}

const attendanceDot: Record<AttendanceStatus, string> = {
  present: "bg-success",
  late: "bg-warning",
  absent: "bg-destructive",
}

const attendanceLabel: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
}

export function AttendanceBadge({
  status,
  className,
}: {
  status: AttendanceStatus
  className?: string
}) {
  return (
    <Badge className={cn("gap-1.5 font-medium", attendanceStyles[status], className)}>
      <span className={cn("size-1.5 rounded-full", attendanceDot[status])} />
      {attendanceLabel[status]}
    </Badge>
  )
}

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  return status === "active" ? (
    <Badge className="gap-1.5 bg-success/12 font-medium text-success">
      <span className="size-1.5 rounded-full bg-success" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1.5 font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground" />
      Inactive
    </Badge>
  )
}
