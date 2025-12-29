"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    activePosters: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      // Total Revenue (from paid orders)
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total_amount, payment_status")
        .eq("payment_status", "paid");

      const totalRevenue =
        revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0) ||
        0;

      // Total Orders
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Total Users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Active Posters
      const { count: postersCount } = await supabase
        .from("posters")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Revenue from last month (for comparison)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const { data: lastMonthRevenueData } = await supabase
        .from("orders")
        .select("total_amount, payment_status, created_at")
        .eq("payment_status", "paid")
        .lt("created_at", lastMonth.toISOString());

      const lastMonthRevenue =
        lastMonthRevenueData?.reduce(
          (sum, order) => sum + parseFloat(order.total_amount.toString()),
          0
        ) || 0;

      const revenueChange =
        lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Orders from last month
      const { count: lastMonthOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .lt("created_at", lastMonth.toISOString());

      const ordersChange =
        lastMonthOrders && lastMonthOrders > 0
          ? (((ordersCount || 0) - lastMonthOrders) / lastMonthOrders) * 100
          : 0;

      setStats({
        totalRevenue,
        totalOrders: ordersCount || 0,
        totalUsers: usersCount || 0,
        activePosters: postersCount || 0,
        revenueChange: Math.round(revenueChange),
        ordersChange: Math.round(ordersChange),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your e-commerce platform</p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          Refresh Stats
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stats.revenueChange !== 0 && (
                <>
                  <TrendingUp
                    className={`h-3 w-3 ${
                      stats.revenueChange > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  {stats.revenueChange > 0 ? "+" : ""}
                  {stats.revenueChange}% from last month
                </>
              )}
              {stats.revenueChange === 0 && "No previous data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stats.ordersChange !== 0 && (
                <>
                  <TrendingUp
                    className={`h-3 w-3 ${
                      stats.ordersChange > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  {stats.ordersChange > 0 ? "+" : ""}
                  {stats.ordersChange}% from last month
                </>
              )}
              {stats.ordersChange === 0 && "No previous data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Posters</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePosters}</div>
            <p className="text-xs text-muted-foreground">Available products</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posters</CardTitle>
            <CardDescription>Manage your poster collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full btn-gold">
              <Link href="/admin/posters">Manage Posters</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
            <CardDescription>Manage discount coupons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/coupons">Manage Coupons</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
