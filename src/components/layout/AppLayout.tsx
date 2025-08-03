import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { SimpleSidebar } from "./SimpleSidebar";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <SimpleSidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-card px-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-4" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-lg">Manufacturing ERP System</h1>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}