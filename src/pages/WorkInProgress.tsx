import { useState } from "react";
import { Search, Clock, User, AlertCircle, CheckCircle, Play, Pause } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for work in progress
const mockWIP = [
  {
    id: "JOB-001",
    title: "Custom Steel Brackets",
    customerName: "ABC Manufacturing",
    assignedTo: "John Smith",
    currentStage: "Cutting",
    progress: 65,
    priority: "high",
    startedAt: "2024-01-15T08:00:00",
    estimatedCompletion: "2024-01-20T17:00:00",
    stages: [
      { name: "Design", status: "completed", completedAt: "2024-01-15T12:00:00" },
      { name: "Material Prep", status: "completed", completedAt: "2024-01-16T10:00:00" },
      { name: "Cutting", status: "in_progress", startedAt: "2024-01-16T14:00:00" },
      { name: "Welding", status: "pending" },
      { name: "Finishing", status: "pending" },
      { name: "Quality Check", status: "pending" },
    ],
    hoursWorked: 18,
    estimatedHours: 32,
  },
  {
    id: "JOB-002",
    title: "Precision Machined Parts",
    customerName: "TechCorp Solutions",
    assignedTo: "Sarah Johnson",
    currentStage: "Machining",
    progress: 45,
    priority: "medium",
    startedAt: "2024-01-14T09:00:00",
    estimatedCompletion: "2024-01-25T16:00:00",
    stages: [
      { name: "Design Review", status: "completed", completedAt: "2024-01-14T11:00:00" },
      { name: "Setup", status: "completed", completedAt: "2024-01-15T09:00:00" },
      { name: "Machining", status: "in_progress", startedAt: "2024-01-15T10:00:00" },
      { name: "Inspection", status: "pending" },
      { name: "Assembly", status: "pending" },
    ],
    hoursWorked: 24,
    estimatedHours: 56,
  },
  {
    id: "JOB-003",
    title: "Automotive Components",
    customerName: "AutoParts Inc",
    assignedTo: "Mike Wilson",
    currentStage: "Quality Check",
    progress: 90,
    priority: "urgent",
    startedAt: "2024-01-10T08:00:00",
    estimatedCompletion: "2024-01-18T15:00:00",
    stages: [
      { name: "Material Sourcing", status: "completed", completedAt: "2024-01-10T16:00:00" },
      { name: "Production", status: "completed", completedAt: "2024-01-16T14:00:00" },
      { name: "Assembly", status: "completed", completedAt: "2024-01-17T12:00:00" },
      { name: "Quality Check", status: "in_progress", startedAt: "2024-01-17T14:00:00" },
      { name: "Packaging", status: "pending" },
    ],
    hoursWorked: 78,
    estimatedHours: 85,
  },
];

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const stageStatusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-green-600" />,
  in_progress: <Play className="h-4 w-4 text-blue-600" />,
  pending: <Clock className="h-4 w-4 text-gray-400" />,
  on_hold: <Pause className="h-4 w-4 text-yellow-600" />,
};

export default function WorkInProgress() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const filteredJobs = mockWIP.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || job.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const uniqueAssignees = Array.from(new Set(mockWIP.map(job => job.assignedTo)));

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
                  <SelectItem key={assignee} value={assignee}>
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
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{job.id}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {job.title}
                  </CardDescription>
                </div>
                <Badge className={priorityColors[job.priority as keyof typeof priorityColors]}>
                  {job.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{job.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Assigned to: {job.assignedTo}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current Stage: </span>
                    <span className="font-medium">{job.currentStage}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Hours: </span>
                    <span className="font-medium">{job.hoursWorked} / {job.estimatedHours}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Production Stages:</h4>
                  <div className="space-y-2">
                    {job.stages.map((stage, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {stageStatusIcons[stage.status as keyof typeof stageStatusIcons]}
                        <span className={stage.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                          {stage.name}
                        </span>
                        {stage.status === 'in_progress' && (
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                    <div>Started: {new Date(job.startedAt).toLocaleDateString()}</div>
                    <div>Est. Completion: {new Date(job.estimatedCompletion).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Update Progress</Button>
                <Button size="sm" variant="outline">Add Notes</Button>
                <Button size="sm" variant="outline">Time Tracking</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}