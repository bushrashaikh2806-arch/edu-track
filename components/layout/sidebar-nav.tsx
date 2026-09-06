"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "./nav-items"

export function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">

      {/* Logo / Branding */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>

        <div className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            EduTrack
          </span>

          <span className="mt-0.5 text-[11px] text-muted-foreground">
            Simplify. Track. Improve.
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">

        <p className="px-3 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Menu
        </p>

        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />

              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-[18px] shrink-0" />
          Logout
        </Link>
      </div>

    </div>
  )
}