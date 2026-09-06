import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AttendanceBadge } from "@/components/status-badge"
import { initials } from "@/lib/format"
import { todayAttendance } from "@/lib/mock-data"

export function TodayAttendance() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Today&apos;s attendance</CardTitle>
          <CardDescription>Latest check-ins recorded this morning.</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/attendance/history" />}
        >
          View all
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAttendance.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {initials(r.studentName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-none">
                        <span className="text-sm font-medium">{r.studentName}</span>
                        <span className="mt-1 text-xs text-muted-foreground">
                          Roll {r.rollNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.className} · {r.division}
                  </TableCell>
                  <TableCell>
                    <AttendanceBadge status={r.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right tabular-nums text-muted-foreground">
                    {r.time ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
