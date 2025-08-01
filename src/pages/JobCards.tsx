import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useJobCards, type JobCard } from "@/hooks/useJobCards";
import { Plus, Search, Eye, Play, Pause } from "lucide-react";

export function JobCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: jobCards, isLoading, error } = useJobCards();
  
  const filteredJobCards = jobCards?.filter(jobCard =>
    jobCard.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobCard.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning border-warning';
      case 'in_progress': return 'text-primary border-primary';
      case 'review': return 'text-accent-foreground border-accent';
      case 'completed': return 'text-success border-success';
      case 'cancelled': return 'text-destructive border-destructive';
      default: return 'text-secondary border-secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive border-destructive';
      case 'high': return 'text-warning border-warning';
      case 'medium': return 'text-primary border-primary';
      case 'low': return 'text-muted-foreground border-muted';
      default: return 'text-secondary border-secondary';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'in_progress': return 50;
      case 'review': return 80;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Job Cards</h1>
          <p className="text-muted-foreground">Loading job cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Job Cards</h1>
          <p className="text-destructive">Error loading job cards: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Cards</h1>
          <p className="text-muted-foreground">Track production jobs through all stages</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobCards.map((jobCard) => (
          <Card key={jobCard.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{jobCard.job_number}</CardTitle>
                  <p className="text-sm text-muted-foreground">{jobCard.title}</p>
                  {jobCard.customers && (
                    <p className="text-xs text-muted-foreground">Customer: {jobCard.customers.name}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Badge 
                    variant="outline"
                    className={getStatusColor(jobCard.status)}
                  >
                    {jobCard.status}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={`${getPriorityColor(jobCard.priority)} text-xs`}
                  >
                    {jobCard.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Estimated Hours</p>
                  <p className="font-medium">{jobCard.estimated_hours || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Actual Hours</p>
                  <p className="font-medium">{jobCard.actual_hours || 'Not set'}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-sm font-medium">{getStatusProgress(jobCard.status)}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${getStatusProgress(jobCard.status)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{jobCard.assigned_to || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {jobCard.due_date ? new Date(jobCard.due_date).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  disabled={jobCard.status === 'completed'}
                >
                  {jobCard.status === 'in_progress' ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Jobs Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Jobs Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {filteredJobCards.filter(jc => jc.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-warning">
                {filteredJobCards.filter(jc => jc.status === 'in_progress').length}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-accent-foreground">
                {filteredJobCards.filter(jc => jc.status === 'review').length}
              </p>
              <p className="text-sm text-muted-foreground">In Review</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-success">
                {filteredJobCards.filter(jc => jc.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}