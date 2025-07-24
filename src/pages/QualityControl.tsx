import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { qcInspections, type QcInspection } from "@/lib/mockData";
import { Shield, CheckCircle, XCircle, AlertTriangle, Eye, Plus } from "lucide-react";

export function QualityControl() {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'Pass': return 'text-success border-success';
      case 'Fail': return 'text-destructive border-destructive';
      case 'Conditional': return 'text-warning border-warning';
      default: return 'text-secondary border-secondary';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'Pass': return <CheckCircle className="h-4 w-4" />;
      case 'Fail': return <XCircle className="h-4 w-4" />;
      case 'Conditional': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quality Control</h1>
          <p className="text-muted-foreground">Inspect products and manage quality standards</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Inspection
        </Button>
      </div>

      {/* QC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passed Inspections
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">15</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Inspections
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3</div>
            <p className="text-xs text-muted-foreground">Awaiting inspection</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Inspections
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Require rework</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qcInspections.map((inspection) => (
              <div key={inspection.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{inspection.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Job Card: {inspection.jobCardId} | Inspector: {inspection.inspectorName}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={getResultColor(inspection.overallResult)}
                  >
                    <span className="flex items-center space-x-1">
                      {getResultIcon(inspection.overallResult)}
                      <span>{inspection.overallResult}</span>
                    </span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Batch Size</p>
                    <p className="font-medium">{inspection.batchSize} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sample Size</p>
                    <p className="font-medium">{inspection.sampleSize} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deviations</p>
                    <p className="font-medium">{inspection.deviations}</p>
                  </div>
                </div>

                {/* CTQ Checks */}
                <div>
                  <p className="text-sm font-medium mb-2">Critical to Quality Checks</p>
                  <div className="space-y-2">
                    {inspection.ctqChecks.map((check, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{check.parameter}</span>
                          <span className="text-muted-foreground ml-2">({check.specification})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{check.measured}</span>
                          <Badge 
                            variant="outline"
                            className={check.result === 'Pass' ? 'text-success border-success' : 'text-destructive border-destructive'}
                          >
                            {check.result}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Inspected: {new Date(inspection.inspectedAt).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Alerts */}
      <Card className="shadow-card border-warning">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Quality Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-warning/10 border border-warning rounded-lg">
              <p className="font-medium text-warning">3-Sigma Deviation Alert</p>
              <p className="text-sm text-muted-foreground">
                Job Card JC-2024-002 has measurements outside acceptable range
              </p>
            </div>
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
              <p className="font-medium text-destructive">Critical Failure</p>
              <p className="text-sm text-muted-foreground">
                Batch requires immediate rework - Contact production manager
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}