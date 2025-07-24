import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardCheck, 
  Cog, 
  Truck, 
  CreditCard,
  ShoppingCart,
  Factory,
  Shield
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Sales & CRM",
    items: [
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Enquiries", url: "/enquiries", icon: FileText },
      { title: "Quotations", url: "/quotations", icon: FileText },
      { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
    ]
  },
  {
    title: "Production",
    items: [
      { title: "Job Cards", url: "/job-cards", icon: ClipboardCheck },
      { title: "Work in Progress", url: "/wip", icon: Factory },
      { title: "Quality Control", url: "/qc", icon: Shield },
      { title: "Tools", url: "/tools", icon: Cog },
    ]
  },
  {
    title: "Operations",
    items: [
      { title: "Dispatch", url: "/dispatch", icon: Truck },
      { title: "Invoices", url: "/invoices", icon: CreditCard },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}>
            Manufacturing ERP
          </h2>
        </div>

        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className={collapsed ? "hidden" : "block"}>
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                        title={item.title}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}