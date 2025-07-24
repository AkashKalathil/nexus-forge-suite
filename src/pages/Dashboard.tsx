import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { 
  FileText, 
  ShoppingCart, 
  Factory, 
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manufacturing ERP System Overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Job Cards"
          value={12}
          icon={Factory}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Pending Quotations"
          value={5}
          icon={FileText}
          trend={{ value: -12, isPositive: false }}
        />
        <MetricCard
          title="Monthly Revenue"
          value="₹8.5L"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Active Customers"
          value={42}
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="QC Pending"
          value={3}
          icon={AlertTriangle}
          className="border-warning"
        />
        <MetricCard
          title="Ready to Dispatch"
          value={7}
          icon={CheckCircle}
          className="border-success"
        />
        <MetricCard
          title="Overdue Payments"
          value={2}
          icon={Clock}
          className="border-destructive"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Production Status */}
        <div className="bg-gradient-primary text-primary-foreground p-6 rounded-lg shadow-elevated">
          <h3 className="text-lg font-semibold mb-4">Production Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Cutting Stage</span>
              <span className="font-semibold">85% Capacity</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Forging Stage</span>
              <span className="font-semibold">72% Capacity</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Heat Treatment</span>
              <span className="font-semibold">45% Capacity</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Precision Finishing</span>
              <span className="font-semibold">63% Capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}