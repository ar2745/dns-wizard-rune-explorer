
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  EyeOff, 
  Loader2, 
  Play,
  PlusCircle, 
  RefreshCw, 
  XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DomainStatus = "healthy" | "warning" | "error";

interface DomainStats {
  total: number;
  healthy: number;
  warning: number;
  error: number;
}

interface Domain {
  name: string;
  status: DomainStatus;
  lastScan: string;
  soaSerial: string;
  recordStats: {
    total: number;
    errors: number;
    warnings: number;
  };
  tags: string[];
}

export function DomainOverview() {
  // Mock data for the domain overview
  const stats: DomainStats = {
    total: 42,
    healthy: 28,
    warning: 11,
    error: 3
  };
  
  const domains: Domain[] = [
    {
      name: "rutgers.edu",
      status: "healthy",
      lastScan: "2025-04-15T10:25:00Z",
      soaSerial: "2025041501",
      recordStats: {
        total: 123,
        errors: 0,
        warnings: 0
      },
      tags: ["critical", "main-domain"]
    },
    {
      name: "admissions.rutgers.edu",
      status: "warning",
      lastScan: "2025-04-15T09:45:00Z",
      soaSerial: "2025041423",
      recordStats: {
        total: 54,
        errors: 0,
        warnings: 2
      },
      tags: ["student-services"]
    },
    {
      name: "cs.rutgers.edu",
      status: "error",
      lastScan: "2025-04-15T08:30:00Z",
      soaSerial: "2025041419",
      recordStats: {
        total: 37,
        errors: 3,
        warnings: 1
      },
      tags: ["department", "science"]
    }
  ];
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  const getStatusIcon = (status: DomainStatus) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Domains</CardTitle>
            <CardDescription>Monitored domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Healthy
            </CardTitle>
            <CardDescription>No issues detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.healthy}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Warnings
            </CardTitle>
            <CardDescription>Require attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.warning}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-500/20 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              Errors
            </CardTitle>
            <CardDescription>Critical issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.error}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Domain Status</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Domains</TabsTrigger>
          <TabsTrigger value="errors">With Errors</TabsTrigger>
          <TabsTrigger value="warnings">With Warnings</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <Card key={domain.name} className={`
                ${domain.status === 'error' ? 'border-l-4 border-l-red-500' : ''}
                ${domain.status === 'warning' ? 'border-l-4 border-l-yellow-500' : ''}
                ${domain.status === 'healthy' ? 'border-l-4 border-l-green-500' : ''}
                hover:shadow-md transition-all
              `}>
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-md flex items-center gap-2">
                      {getStatusIcon(domain.status)}
                      {domain.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(domain.lastScan)}
                      <span className="mx-1">•</span>
                      SOA: {domain.soaSerial}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 flex-wrap">
                      {domain.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="errors" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.filter(d => d.status === 'error').map((domain) => (
              <Card key={domain.name} className="border-l-4 border-l-red-500 hover:shadow-md transition-all">
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-md flex items-center gap-2">
                      {getStatusIcon(domain.status)}
                      {domain.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(domain.lastScan)}
                      <span className="mx-1">•</span>
                      SOA: {domain.soaSerial}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 flex-wrap">
                      {domain.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="warnings" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.filter(d => d.status === 'warning').map((domain) => (
              <Card key={domain.name} className="border-l-4 border-l-yellow-500 hover:shadow-md transition-all">
                {/* Similar card content as above */}
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-md flex items-center gap-2">
                      {getStatusIcon(domain.status)}
                      {domain.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(domain.lastScan)}
                      <span className="mx-1">•</span>
                      SOA: {domain.soaSerial}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 flex-wrap">
                      {domain.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist" className="mt-0">
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-muted-foreground mb-4">No domains in your watchlist yet</p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Watchlist
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
