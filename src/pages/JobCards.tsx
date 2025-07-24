import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { jobCards, wipEntries, type JobCard } from "@/lib/mockData";
import { Plus, Search, Eye, Play, Pause } from "lucide-react";

export function JobCards() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredJobCards = jobCards.filter(jobCard =>
    jobCard.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobCard.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: JobCard['status']) => {
    switch (status) {
      case 'Pending RM': return 'text-warning border-warning';
      case 'In Progress': return 'text-primary border-primary';
      case 'QC': return 'text-accent-foreground border-accent';
      case 'Completed': return 'text-success border-success';
      case 'Rework': return 'text-destructive border-destructive';
      default: return 'text-secondary border-secondary';
    }
  };

  const getStageProgress = (currentStage: string) => {
    const stages = ['Cutting', 'Forging', 'HT', 'PF', 'QC', 'Dispatch'];
    const currentIndex = stages.indexOf(currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

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
                  <CardTitle className="text-lg">{jobCard.jobNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{jobCard.productName}</p>
                </div>
                <Badge 
                  variant="outline"
                  className={getStatusColor(jobCard.status)}
                >
                  {jobCard.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{jobCard.quantity} units</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Stage</p>
                  <p className="font-medium">{jobCard.currentStage}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Production Progress</p>
                  <p className="text-sm font-medium">{Math.round(getStageProgress(jobCard.currentStage))}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${getStageProgress(jobCard.currentStage)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">RM Batch</p>
                  <p className="font-medium">{jobCard.rmBatchId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RM Status</p>
                  <Badge variant={jobCard.rmApproved ? 'default' : 'secondary'}>
                    {jobCard.rmApproved ? 'Approved' : 'Pending'}
                  </Badge>
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
                  disabled={jobCard.status === 'Completed'}
                >
                  {jobCard.status === 'In Progress' ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* WIP Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Active Work in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wipEntries.filter(wip => wip.status === 'In Progress').map((wip) => (
              <div key={wip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{wip.stage}</p>
                  <p className="text-sm text-muted-foreground">Operator: {wip.operatorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Job Card</p>
                  <p className="font-medium">{wip.jobCardId}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}