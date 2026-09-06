"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
} from "lucide-react"

import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { toast } from "sonner"

export function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("admin@edutrack.edu")
  const [password, setPassword] = useState("password")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      toast.success("Welcome back to EduTrack.")

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)

      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">

      {/* Left / brand panel */}
      <section className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">

        <div className="relative z-10 flex items-center gap-2.5 text-primary-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <GraduationCap className="size-5" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            EduTrack
          </span>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-primary-foreground/10 ring-1 ring-primary-foreground/15">

            <Image
              src="/login-illustration.png"
              alt="Illustration of students using EduTrack to track attendance"
              width={640}
              height={640}
              className="h-auto w-full"
              priority
            />

          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 text-primary-foreground">

          <h2 className="text-2xl font-semibold text-balance">
            Student Management &amp; Attendance System
          </h2>

          <p className="max-w-md text-sm text-primary-foreground/80 text-pretty">
            Simplify. Track. Improve. Everything your institution needs to
            manage students, staff and attendance in one calm, connected place.
          </p>

        </div>

      </section>

      {/* Right / form panel */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">

            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>

            <span className="text-lg font-semibold tracking-tight">
              EduTrack
            </span>

          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1.5">

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm text-muted-foreground">
              Sign in to your administrator account to continue.
            </p>

          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8">

            <FieldGroup>

              {/* Email */}
              <Field>

                <FieldLabel htmlFor="email">
                  Email or username
                </FieldLabel>

                <InputGroup>

                  <InputGroupInput
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />

                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>

                </InputGroup>

              </Field>

              {/* Password */}
              <Field>

                <div className="flex items-center justify-between">

                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() =>
                      toast.info(
                        "Please contact your administrator to reset your password."
                      )
                    }
                    disabled={loading}
                  >
                    Forgot password?
                  </button>

                </div>

                <InputGroup>

                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>

                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />

                  <InputGroupAddon align="inline-end">

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((s) => !s)
                      }
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      disabled={loading}
                    >

                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}

                    </button>

                  </InputGroupAddon>

                </InputGroup>

              </Field>

              {/* Remember me */}
              <Field orientation="horizontal">

                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) =>
                    setRemember(Boolean(v))
                  }
                  disabled={loading}
                />

                <FieldLabel
                  htmlFor="remember"
                  className="font-normal text-muted-foreground"
                >
                  Remember me for 30 days
                </FieldLabel>

              </Field>

              {/* Login button */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >

                {loading ? (
                  <Loader2
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 data-icon="inline-start" />
                )}

                {loading
                  ? "Signing in…"
                  : "Login"}

              </Button>

            </FieldGroup>

          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">

            Don&apos;t have an account?{" "}

            <span className="font-medium text-foreground">
              Contact administrator
            </span>

          </p>

        </div>

      </section>

    </main>
  )
}