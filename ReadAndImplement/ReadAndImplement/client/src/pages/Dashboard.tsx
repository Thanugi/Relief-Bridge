import { useApp } from "@/lib/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Download, Search, Trash2, MapPin, Phone, Clock, User, Eye, ImageIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { reports, deleteReport } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.id.includes(searchTerm);
    const matchesSeverity = severityFilter === "All" || report.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Location", "Severity", "Status", "Needs", "Contact", "Description", "Evidence", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...filteredReports.map(r => [
        r.id,
        `"${r.name}"`,
        `"${r.location}"`,
        r.severity,
        r.status,
        `"${r.needs.join(';')}"`,
        r.contact,
        `"${r.description}"`,
        r.evidence ? "Yes" : "No",
        r.timestamp
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relief-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of all reported incidents.</p>
        </div>
        <Button variant="outline" onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, name, location, or description..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
           <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
             No reports found matching your criteria.
           </div>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="flex flex-col relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${getSeverityColor(report.severity)}`}></div>
                <CardHeader className="pb-2 pl-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <SeverityBadge severity={report.severity} />
                                <span className="text-xs text-muted-foreground font-mono">#{report.id}</span>
                            </div>
                            <CardTitle className="text-lg leading-tight">{report.location}</CardTitle>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteReport(report.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pb-4 pl-6 flex-1 space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <span className="font-medium">{report.name}</span>
                                {report.type === 'relative' && <span className="text-xs text-muted-foreground ml-1">(Relative)</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <a href={`tel:${report.contact}`} className="hover:underline text-primary">{report.contact}</a>
                        </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-md text-sm">
                        <p className="text-foreground/90">{report.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {report.needs.map(need => (
                            <Badge key={need} variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto font-normal bg-background">{need}</Badge>
                        ))}
                    </div>

                    {report.evidence && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8 mt-2">
                            <ImageIcon className="h-3 w-3" />
                            View Evidence Photo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Evidence Photo</DialogTitle>
                            <DialogDescription>
                              Uploaded by {report.name} for incident at {report.location}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 flex justify-center bg-muted/20 rounded-lg overflow-hidden border">
                            <img 
                              src={report.evidence} 
                              alt="Evidence" 
                              className="max-h-[60vh] w-auto object-contain" 
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                </CardContent>
                <CardFooter className="pt-0 pl-6 text-xs text-muted-foreground border-t bg-muted/10 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.timestamp).toLocaleString()}
                    </div>
                    <StatusBadge status={report.status} />
                </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function getSeverityColor(severity: string) {
    switch(severity) {
        case 'Critical': return 'bg-red-600';
        case 'Very High': return 'bg-orange-500';
        case 'High': return 'bg-yellow-500';
        case 'Moderate': return 'bg-blue-500';
        default: return 'bg-slate-400';
    }
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    'Critical': 'bg-red-100 text-red-800 border-red-200',
    'Very High': 'bg-orange-100 text-orange-800 border-orange-200',
    'High': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Moderate': 'bg-blue-100 text-blue-800 border-blue-200',
    'Low': 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${colors[severity] || colors['Low']}`}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
      'Pending': 'text-slate-500',
      'Verified': 'text-blue-600 font-medium',
      'Resolved': 'text-green-600 font-medium',
    };
  
    return (
      <span className={`inline-flex items-center ${colors[status] || colors['Pending']}`}>
        {status}
      </span>
    );
  }
