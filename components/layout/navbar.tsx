"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { SidebarNav } from "./sidebar-nav"
import { titleForPath } from "./nav-items"

import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const title = titleForPath(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">

      {/* Mobile Menu */}

      <Sheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      >
        <SheetTrigger
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-72 p-0"
        >
          <SheetTitle className="sr-only">
            Navigation menu
          </SheetTitle>

          <SidebarNav
            onNavigate={() =>
              setMobileOpen(false)
            }
          />
        </SheetContent>
      </Sheet>

      {/* Page Title */}

      <h1 className="text-lg font-semibold tracking-tight">
        {title}
      </h1>

    </header>
  )
}