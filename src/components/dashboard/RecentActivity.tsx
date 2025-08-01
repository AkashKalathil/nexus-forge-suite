import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Clock, User, FileText } from "lucide-react";

const getActionColor = (action: string) => {
  if (action.toLowerCase().includes('create')) return 'text-success border-success';
  if (action.toLowerCase().includes('update')) return 'text-warning border-warning';
  if (action.toLowerCase().includes('complete')) return 'text-primary border-primary';
  if (action.toLowerCase().includes('delete')) return 'text-destructive border-destructive';
  return 'text-secondary border-secondary';
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity(8);

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading recent activity...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <Badge 
                      variant="outline" 
                      className={`${getActionColor(activity.action)} text-xs`}
                    >
                      {activity.entity_type}
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{activity.user_name || 'System'}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}