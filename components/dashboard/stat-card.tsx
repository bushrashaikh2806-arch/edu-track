import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  tone = "primary",
}: {
  label: string
  value: string
  hint?: string
  trend?: number
  icon: LucideIcon
  tone?: "primary" | "success" | "warning" | "destructive"
}) {
  const toneClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/12 text-destructive",
  }
  const positive = (trend ?? 0) >= 0

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              toneClasses[tone],
            )}
          >
            <Icon className="size-5" />
          </span>
          {typeof trend === "number" ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                positive
                  ? "bg-success/12 text-success"
                  : "bg-destructive/12 text-destructive",
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(trend)}%
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {hint ? (
            <p className="text-xs text-muted-foreground/70">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
