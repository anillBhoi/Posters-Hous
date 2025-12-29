"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminDebugPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDbProfile();
    }
  }, [user]);

  const fetchDbProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id || "")
        .single();

      if (error) throw error;
      setDbProfile(data);
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoadingDb(false);
    }
  };

  const fixAdminRole = async () => {
    try {
      // First, try to create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user?.id,
          email: user?.email,
          role: "admin",
          full_name: user?.user_metadata?.full_name || "Admin User",
        });

      // If insert fails (profile exists), update it
      if (insertError) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", user?.id || "");

        if (updateError) throw updateError;
      }

      alert("Profile created/updated! Please logout and login again.");
      window.location.reload();
    } catch (error: any) {
      alert("Error: " + error.message + "\n\nTry running the SQL query in Supabase instead.");
    }
  };

  if (loading || loadingDb) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-medium mb-8">Admin Access Debug</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth Context Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>User:</strong> {user ? user.email : "Not logged in"}
            </p>
            <p>
              <strong>User ID:</strong> {user?.id || "N/A"}
            </p>
            <p>
              <strong>Profile Loaded:</strong> {profile ? "Yes" : "No"}
            </p>
            <p>
              <strong>Profile Role:</strong> {profile?.role || "N/A"}
            </p>
            <p>
              <strong>Is Admin:</strong> {isAdmin ? "✅ YES" : "❌ NO"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dbProfile ? (
              <>
                <p>
                  <strong>Email:</strong> {dbProfile.email}
                </p>
                <p>
                  <strong>Role:</strong> {dbProfile.role}
                </p>
                <p>
                  <strong>Full Name:</strong> {dbProfile.full_name || "N/A"}
                </p>
                {dbProfile.role !== "admin" && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800 mb-2">
                      ⚠️ Role is not 'admin' in database!
                    </p>
                    <Button onClick={fixAdminRole} size="sm">
                      Fix: Set Role to Admin
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Profile not found in database</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Fix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If role is not 'admin', click the button below to fix it automatically.
            </p>
            <Button onClick={fixAdminRole} className="btn-gold">
              Set My Role to Admin
            </Button>
            <p className="text-xs text-muted-foreground">
              After clicking, logout and login again to see changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SQL Query to Run in Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">If profile doesn't exist, run this:</p>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                <pre className="whitespace-pre-wrap">
{`-- Delete old profile if exists
DELETE FROM profiles WHERE email = '${user?.email || "your-email@example.com"}';

-- Create profile with correct ID
INSERT INTO profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin'::user_role,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE email = '${user?.email || "your-email@example.com"}';`}
                </pre>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Or if profile exists with wrong ID, run this:</p>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                <pre className="whitespace-pre-wrap">
{`UPDATE profiles 
SET role = 'admin' 
WHERE id = '${user?.id || "your-user-id"}';`}
                </pre>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy the appropriate query and run it in Supabase SQL Editor, then logout and login again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

