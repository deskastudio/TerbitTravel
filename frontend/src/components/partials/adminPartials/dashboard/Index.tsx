import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/partials/adminPartials/dashboard/date-range-picker";
import Overview from "@/components/partials/adminPartials/dashboard/overview";
import RecentSales from "@/components/partials/adminPartials/dashboard/recent-sales";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2, Users, ShoppingBag, DollarSign, Package } from "lucide-react";

const DashboardPage = () => {
  const { stats, loading, error, refetch } = useDashboard();

  console.log("🎯 Dashboard Component - Current stats:", stats);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Dashboard Title and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <CalendarDateRangePicker />
          <Button size="sm" className="sm:text-base">
            Download
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Cards Section */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage(stats?.revenueGrowth || 0)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  +{stats?.totalUsers || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage(stats?.userGrowth || 0)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  +{stats?.totalBookings || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage(stats?.bookingGrowth || 0)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tour Packages
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  +{stats?.totalPackages || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage(stats?.packageGrowth || 0)} from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overview and Recent Sales Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview data={stats?.monthlyRevenue || []} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  You made {stats?.totalBookings || 0} bookings this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales bookings={stats?.recentBookings || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardPage;
