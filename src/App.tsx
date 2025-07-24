import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Customers } from "./pages/Customers";
import { JobCards } from "./pages/JobCards";
import { QualityControl } from "./pages/QualityControl";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/enquiries" element={<div className="p-6"><h1>Enquiries - Coming Soon</h1></div>} />
            <Route path="/quotations" element={<div className="p-6"><h1>Quotations - Coming Soon</h1></div>} />
            <Route path="/purchase-orders" element={<div className="p-6"><h1>Purchase Orders - Coming Soon</h1></div>} />
            <Route path="/job-cards" element={<JobCards />} />
            <Route path="/wip" element={<div className="p-6"><h1>Work in Progress - Coming Soon</h1></div>} />
            <Route path="/qc" element={<QualityControl />} />
            <Route path="/tools" element={<div className="p-6"><h1>Tools Management - Coming Soon</h1></div>} />
            <Route path="/dispatch" element={<div className="p-6"><h1>Dispatch Management - Coming Soon</h1></div>} />
            <Route path="/invoices" element={<div className="p-6"><h1>Invoices - Coming Soon</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
