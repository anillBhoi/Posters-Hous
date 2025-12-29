"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "user" | "admin";
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      // Check current session first
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Fetching profile - Current session:", {
        userId: userId,
        sessionUserId: currentSession?.user?.id,
        sessionEmail: currentSession?.user?.email,
        sessionMatches: currentSession?.user?.id === userId
      });

      // Try fetching by ID first
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Better error logging
        const errorDetails = {
          message: error?.message || 'No message',
          code: error?.code || 'No code',
          details: error?.details || 'No details',
          hint: error?.hint || 'No hint',
          userId: userId,
          userEmail: userEmail,
          errorType: error?.constructor?.name || 'Unknown',
          errorString: String(error),
          errorKeys: Object.keys(error || {})
        };
        
        console.error("Error fetching profile by ID:", errorDetails);
        
        // If RLS error (PGRST116) or not found, try fetching by email as fallback
        if (userEmail && (error?.code === 'PGRST116' || error?.code === 'PGRST301')) {
          console.log("Attempting to fetch profile by email as fallback...");
          const { data: emailData, error: emailError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", userEmail)
            .single();
          
          if (emailError) {
            console.error("Error fetching profile by email:", {
              message: emailError?.message,
              code: emailError?.code,
              details: emailError?.details,
              email: userEmail
            });
            throw emailError;
          }
          
          if (emailData) {
            console.log("Profile loaded by email fallback:", { 
              id: emailData.id, 
              email: emailData.email, 
              role: emailData.role 
            });
            setProfile(emailData as Profile);
            return;
          }
        }
        
        throw error;
      }
      
      if (data) {
        console.log("Profile loaded successfully:", { 
          id: data.id, 
          email: data.email, 
          role: data.role 
        });
        setProfile(data as Profile);
      } else {
        console.warn("No profile data returned for user:", userId);
      }
    } catch (error: any) {
      // Enhanced error logging
      const errorInfo = {
        errorType: error?.constructor?.name,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error?.stack,
        stringified: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        allKeys: error ? Object.keys(error) : []
      };
      console.error("Error fetching profile (catch block):", errorInfo);
      // Don't set profile to null, keep existing if any
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        toast.success("Account created! Please check your email to verify your account.");
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || "Failed to create account");
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success("Welcome back!");
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || "Failed to sign in");
      return { error: authError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Failed to sign in with Google");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success("Password reset email sent! Check your inbox.");
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || "Failed to send reset email");
      return { error: authError };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      await fetchProfile(user.id);
      toast.success("Profile updated successfully");
      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update profile");
      return { error: err };
    }
  };

  const isAdmin = profile?.role === "admin";

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
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

