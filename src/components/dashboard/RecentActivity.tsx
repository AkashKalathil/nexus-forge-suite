import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  type: 'enquiry' | 'quotation' | 'po' | 'job_card' | 'qc' | 'dispatch';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'enquiry',
    title: 'New Enquiry Received',
    description: 'ABC Manufacturing Ltd - Forged Steel Component (500 units)',
    timestamp: '2 hours ago',
    status: 'new'
  },
  {
    id: '2',
    type: 'qc',
    title: 'QC Inspection Completed',
    description: 'JC-2024-001 - Precision Machined Shaft - PASSED',
    timestamp: '4 hours ago',
    status: 'passed'
  },
  {
    id: '3',
    type: 'po',
    title: 'Purchase Order Confirmed',
    description: 'PO-XYZ-2024-001 - ₹2,50,000',
    timestamp: '6 hours ago',
    status: 'confirmed'
  },
  {
    id: '4',
    type: 'dispatch',
    title: 'Dispatch Pending Documents',
    description: 'DISP001 - Missing E-Way Bill & Gate Pass',
    timestamp: '8 hours ago',
    status: 'pending'
  }
];

const getStatusColor = (type: string, status?: string) => {
  if (status === 'new' || status === 'pending') return 'warning';
  if (status === 'passed' || status === 'confirmed') return 'success';
  return 'secondary';
};

export function RecentActivity() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <Badge variant="outline" className={`text-xs ${
                    getStatusColor(activity.type, activity.status) === 'success' ? 'border-success text-success' :
                    getStatusColor(activity.type, activity.status) === 'warning' ? 'border-warning text-warning' :
                    'border-secondary text-secondary-foreground'
                  }`}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}