"use client"

import { useState } from "react"
import  PersonalInfo  from "@/components/partials/mainPartials/user-profile/personal-info"
import  OrderHistory  from "@/components/partials/mainPartials/user-profile/order-history"
import  TestimonialHistory  from "@/components/partials/mainPartials/user-profile/testimonial-history"
import  UpdatePassword  from "@/components/partials/mainPartials/user-profile/update-password"
import  SavedDestinations  from "@/components/partials/mainPartials/user-profile/saved-destination"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

const menuItems = [
  { id: "personal-info", label: "Personal Info" },
  { id: "order-history", label: "Order History" },
  { id: "testimonials", label: "Testimonials" },
  { id: "update-password", label: "Update Password" },
  { id: "saved-destinations", label: "Saved Destinations" },
]

export default function UserProfilePage() {
  const [activeSection, setActiveSection] = useState("personal-info")

  const renderContent = () => {
    switch (activeSection) {
      case "personal-info":
        return <PersonalInfo />
      case "order-history":
        return <OrderHistory />
      case "testimonials":
        return <TestimonialHistory />
      case "update-password":
        return <UpdatePassword />
      case "saved-destinations":
        return <SavedDestinations />
      default:
        return <PersonalInfo />
    }
  }

  const SidebarContent = () => (
    <ScrollArea className="h-full mt-8">
      <div className="space-y-2 py-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">User Profile</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            {/* Sidebar for larger screens */}
            <aside className="hidden md:block w-64 bg-gray-100 p-4">
              <SidebarContent />
            </aside>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Main content area */}
            <main className="flex-1 p-4 sm:p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

