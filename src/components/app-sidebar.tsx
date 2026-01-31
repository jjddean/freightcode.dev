import * as React from "react"
import {
  LayoutDashboard,
  Ship,
  Package,
  FileText,
  CreditCard,
  File,
  ShieldCheck,
  BarChart3,
  Settings,
  Terminal,
} from "lucide-react"

import { useLocation } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Shipments",
    url: "/shipments",
    icon: Ship,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Package,
  },
  {
    title: "Quotes",
    url: "/quotes",
    icon: FileText,
  },
]

const navDocuments = [
  {
    name: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    name: "Documents",
    url: "/documents",
    icon: File,
  },
  {
    name: "Compliance",
    url: "/compliance",
    icon: ShieldCheck,
  },
  {
    name: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
]

const navSecondary = [
  {
    title: "Account",
    url: "/account",
    icon: Settings,
  },
  {
    title: "Dev API",
    url: "/api",
    icon: Terminal,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const location = useLocation()

  const userData = user
    ? {
      name: user.fullName || user.firstName || "User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatar: user.imageUrl || "",
    }
    : {
      name: "Guest",
      email: "",
      avatar: "",
    }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 border-b">
        <a href="/dashboard" className="flex items-center gap-3 px-4 h-full">
          <img src="/freightcode-logo.png" alt="freightcode®" className="h-9 w-9 object-contain" />
          <span className="truncate text-lg font-bold text-[#003057] group-data-[collapsible=icon]:hidden">freightcode®</span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={navDocuments} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
