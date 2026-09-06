  "use client"

  import useSWR from "swr"
  import { Bell, Info, CheckCircle2, AlertTriangle } from "lucide-react"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
  import { Skeleton } from "@/components/ui/skeleton"
  import { cn } from "@/lib/utils"
  import { getNotifications, markNotificationsRead } from "@/lib/api"
  import type { AppNotification } from "@/lib/types"

  const iconMap = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
  }

  const toneMap = {
    info: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  }

  export function Notifications() {
    const { data, isLoading, mutate } = useSWR<AppNotification[]>(
      "notifications",
      getNotifications,
    )
    const unread = data?.filter((n) => !n.read).length ?? 0

    async function handleMarkRead() {
      if (!data) return
      await mutate(markNotificationsRead(), {
        optimisticData: data.map((n) => ({ ...n, read: true })),
        revalidate: false,
      })
    }

    return (
      <Popover>
        <PopoverTrigger
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Bell className="size-[18px]" />
          {unread > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
              {unread}
            </span>
          ) : null}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs text-primary"
                onClick={handleMarkRead}
              >
                Mark all read
              </Button>
            ) : null}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y">
                {data?.map((n) => {
                  const Icon = iconMap[n.type]
                  return (
                    <li
                      key={n.id}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                        !n.read && "bg-primary/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          toneMap[n.type],
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <p className="text-sm font-medium leading-snug">{n.title}</p>
                        <p className="text-xs text-muted-foreground text-pretty">
                          {n.description}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                          {n.time}
                        </p>
                      </div>
                      {!n.read ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
