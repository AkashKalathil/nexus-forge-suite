import { useState } from "react";
import { Search, Clock, User, CheckCircle, Play, Pause } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobCards, useUpdateJobCard } from "@/hooks/useJobCards";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const stageStatusIcons: Record<string, JSX.Element> = {
  completed: <CheckCircle className="h-4 w-4 text-green-600" />,
  in_progress: <Play className="h-4 w-4 text-blue-600" />,
  pending: <Clock className="h-4 w-4 text-gray-400" />,
  on_hold: <Pause className="h-4 w-4 text-yellow-600" />,
};

export default function WorkInProgress() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const { data: jobCards = [], isLoading, error } = useJobCards();
  const updateJobCard = useUpdateJobCard();

  // Filter only active jobs (in_progress status)
  const activeJobs = jobCards.filter(job => 
    job.status === 'in_progress' || job.status === 'pending' || job.status === 'review'
  );

  const filteredJobs = activeJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.customers?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || job.assigned_to === assigneeFilter;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const uniqueAssignees = Array.from(new Set(activeJobs.map(job => job.assigned_to).filter(Boolean)));

  const getProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'in_progress': return 50;
      case 'review': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const handleUpdateProgress = async (jobId: string, newStatus: string) => {
    await updateJobCard.mutateAsync({ id: jobId, updates: { status: newStatus } });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work in Progress</h1>
            <p className="text-muted-foreground">Monitor active jobs and production progress</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading work in progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work in Progress</h1>
            <p className="text-muted-foreground">Monitor active jobs and production progress</p>
          </div>
        </div>
        <ErrorMessage title="Failed to load work in progress" message={error.message || 'Please try refreshing the page'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work in Progress</h1>
          <p className="text-muted-foreground">
            Monitor active jobs and production progress
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{activeJobs.filter(j => j.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{activeJobs.filter(j => j.status === 'in_progress').length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-foreground">{activeJobs.filter(j => j.status === 'review').length}</p>
              <p className="text-sm text-muted-foreground">In Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{activeJobs.length}</p>
              <p className="text-sm text-muted-foreground">Total Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee || ''}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* WIP Jobs */}
      <div className="grid gap-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active jobs found. Jobs will appear here when they are in progress.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.job_number}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {job.title}
                    </CardDescription>
                  </div>
                  <Badge className={priorityColors[job.priority as string] || priorityColors.medium}>
                    {job.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{job.customers?.name || 'No customer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Assigned to: {job.assigned_to || 'Unassigned'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{getProgress(job.status)}%</span>
                      </div>
                      <Progress value={getProgress(job.status)} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current Status: </span>
                      <span className="font-medium capitalize">{job.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Hours: </span>
                      <span className="font-medium">{job.actual_hours || 0} / {job.estimated_hours || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Status Progression:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {job.status === 'pending' ? stageStatusIcons.in_progress : stageStatusIcons.completed}
                        <span className={job.status !== 'pending' ? 'line-through text-muted-foreground' : ''}>
                          Pending
                        </span>
                        {job.status === 'pending' && <Badge variant="outline" className="text-xs">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {job.status === 'in_progress' ? stageStatusIcons.in_progress : 
                         ['review', 'completed'].includes(job.status) ? stageStatusIcons.completed : stageStatusIcons.pending}
                        <span className={['review', 'completed'].includes(job.status) ? 'line-through text-muted-foreground' : ''}>
                          In Progress
                        </span>
                        {job.status === 'in_progress' && <Badge variant="outline" className="text-xs">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {job.status === 'review' ? stageStatusIcons.in_progress : 
                         job.status === 'completed' ? stageStatusIcons.completed : stageStatusIcons.pending}
                        <span className={job.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                          Review
                        </span>
                        {job.status === 'review' && <Badge variant="outline" className="text-xs">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {job.status === 'completed' ? stageStatusIcons.completed : stageStatusIcons.pending}
                        <span>Completed</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                      <div>Created: {new Date(job.created_at).toLocaleDateString()}</div>
                      {job.due_date && <div>Due: {new Date(job.due_date).toLocaleDateString()}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {job.status === 'pending' && (
                    <Button size="sm" onClick={() => handleUpdateProgress(job.id, 'in_progress')}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Work
                    </Button>
                  )}
                  {job.status === 'in_progress' && (
                    <Button size="sm" onClick={() => handleUpdateProgress(job.id, 'review')}>
                      Move to Review
                    </Button>
                  )}
                  {job.status === 'review' && (
                    <Button size="sm" onClick={() => handleUpdateProgress(job.id, 'completed')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
