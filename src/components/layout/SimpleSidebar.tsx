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
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

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

interface SimpleSidebarProps {
  collapsed: boolean;
}

export function SimpleSidebar({ collapsed }: SimpleSidebarProps) {
  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300",
      collapsed ? "w-14" : "w-64"
    )}>
      <div className="p-4">
        <h2 className={cn(
          "font-bold text-lg",
          collapsed ? "hidden" : "block"
        )}>
          Manufacturing ERP
        </h2>
      </div>

      <nav className="space-y-2 p-2">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </div>
            )}
            
            {section.items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
                title={item.title}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}