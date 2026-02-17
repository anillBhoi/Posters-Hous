"use client"

// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { AuthError, Session, User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/types/supabase"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

interface AuthContextType {
  user: User | null
  profile: ProfileRow | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: ProfileUpdate) => Promise<{ error: Error | null }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      // 1) Fetch by id (primary path)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single<ProfileRow>()

      if (!error && data) {
        setProfile(data)
        return
      }

      // If not found / RLS / etc., optionally fallback to email
      if (userEmail) {
        const { data: emailData, error: emailError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", userEmail)
          .single<ProfileRow>()

        if (!emailError && emailData) {
          setProfile(emailData)
          return
        }

        // Log fallback error (but don't hard-fail the app)
        if (emailError) {
          console.error("Profile fetch by email failed:", {
            message: emailError.message,
            code: (emailError as any).code,
            details: (emailError as any).details,
            hint: (emailError as any).hint,
          })
        }
      }

      // Log primary error
      if (error) {
        console.error("Profile fetch by id failed:", {
          message: error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        })
      }
    } catch (e) {
      console.error("fetchProfile unexpected error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial session
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const sess = data.session
        setSession(sess)
        setUser(sess?.user ?? null)

        if (sess?.user) {
          fetchProfile(sess.user.id, sess.user.email ?? undefined)
        } else {
          setLoading(false)
        }
      })
      .catch((e) => {
        console.error("getSession error:", e)
        setLoading(false)
      })

    // Auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess)
      setUser(sess?.user ?? null)

      if (sess?.user) {
        setLoading(true)
        await fetchProfile(sess.user.id, sess.user.email ?? undefined)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => authListener.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName ?? "" },
        },
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      // If confirm email is ON, this is expected
      if (data.user) toast.success("Account created. Check your email for verification (if enabled).")
      return { error: null }
    } catch (e) {
      const authError = e as AuthError
      toast.error(authError.message || "Failed to create account")
      return { error: authError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        return { error }
      }
      toast.success("Welcome back!")
      return { error: null }
    } catch (e) {
      const authError = e as AuthError
      toast.error(authError.message || "Failed to sign in")
      return { error: authError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) toast.error(error.message)
    } catch {
      toast.error("Failed to sign in with Google")
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Signed out successfully")
    } catch {
      toast.error("Failed to sign out")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success("Password reset email sent! Check your inbox.")
      return { error: null }
    } catch (e) {
      const authError = e as AuthError
      toast.error(authError.message || "Failed to send reset email")
      return { error: authError }
    }
  }

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)
      if (error) throw error

      await fetchProfile(user.id, user.email ?? undefined)
      toast.success("Profile updated successfully")
      return { error: null }
    } catch (e) {
      const err = e as Error
      toast.error(err.message || "Failed to update profile")
      return { error: err }
    }
  }

  const isAdmin = useMemo(() => profile?.role === "admin", [profile?.role])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
