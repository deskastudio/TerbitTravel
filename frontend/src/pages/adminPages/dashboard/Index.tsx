import AppSidebar from "@/components/partials/adminPartials/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/partials/adminPartials/dashboard/date-range-picker";
import Overview from "@/components/partials/adminPartials/dashboard/overview";
import RecentSales from "@/components/partials/adminPartials/dashboard/recent-sales";
import Search from "@/components/partials/adminPartials/dashboard/search";
import UserNav from "@/components/partials/adminPartials/dashboard/user-nav";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header Section */}
        <header className="flex h-16 items-center gap-2 px-4 bg-background border-b md:px-8">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <Search />
            <UserNav />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
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
              <TabsTrigger value="analytics">
                Analytics
              </TabsTrigger>
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
                  <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Total Revenue</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">
                      $45,231.89
                    </div>
                    <p className="text-sm text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Subscriptions</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">+2350</div>
                    <p className="text-sm text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">+12,234</div>
                    <p className="text-sm text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Active Now</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">+573</div>
                    <p className="text-sm text-muted-foreground">
                      +201 since last hour
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
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;