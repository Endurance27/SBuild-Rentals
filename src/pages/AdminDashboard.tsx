import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch items count
        const { count: itemsCount } = await supabase
          .from("rental_items")
          .select("*", { count: "exact", head: true });

        // Fetch bookings
        const { data: bookings } = await supabase
          .from("bookings")
          .select("status, total_cost");

        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0;
        const totalRevenue = bookings
          ?.filter(b => b.status === "confirmed" || b.status === "completed")
          .reduce((sum, b) => sum + Number(b.total_cost), 0) || 0;

        setStats({
          totalItems: itemsCount || 0,
          totalBookings,
          pendingBookings,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: ClipboardList,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: `₵${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your rental business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
