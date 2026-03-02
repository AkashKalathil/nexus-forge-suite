import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Customers } from "./pages/Customers";
import Enquiries from "./pages/Enquiries";
import Quotations from "./pages/Quotations";
import PurchaseOrders from "./pages/PurchaseOrders";
import { JobCards } from "./pages/JobCards";
import WorkInProgress from "./pages/WorkInProgress";
import { QualityControl } from "./pages/QualityControl";
import Tools from "./pages/Tools";
import Dispatch from "./pages/Dispatch";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";
import { AIChatbot } from "./components/chat/AIChatbot";

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
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/job-cards" element={<JobCards />} />
            <Route path="/wip" element={<WorkInProgress />} />
            <Route path="/qc" element={<QualityControl />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/invoices" element={<Invoices />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
