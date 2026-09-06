import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "EduTrack — Student Management & Attendance System",
  description:
    "EduTrack is a modern student management and attendance system.",
  icons: {
    icon: "/book.svg",
    apple: "/book.svg",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f7fb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}