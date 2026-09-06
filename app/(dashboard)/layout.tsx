import type { ReactNode } from "react"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Navbar } from "@/components/layout/navbar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <Navbar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}