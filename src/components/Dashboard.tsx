
import { DashboardHeader } from "@/components/DashboardHeader";
import { DomainOverview } from "@/components/DomainOverview";
import { DNSRecordInspector } from "@/components/DNSRecordInspector";
import { SecurityValidator } from "@/components/SecurityValidator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Bell, List, Shield, Zap } from "lucide-react";

export function Dashboard() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <DashboardHeader />
      
      <main className="space-y-6">
        <DomainOverview />
        
        <Tabs defaultValue="records" className="space-y-4">
          <TabsList>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">DNS Records</span>
              <span className="sm:hidden">Records</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="mt-0 space-y-4">
            <DNSRecordInspector />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0 space-y-4">
            <SecurityValidator />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-0">
            <div className="h-96 flex items-center justify-center bg-card rounded-lg border">
              <p className="text-muted-foreground">Performance monitoring module coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <div className="h-96 flex items-center justify-center bg-card rounded-lg border">
              <p className="text-muted-foreground">Alerts configuration module coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-0">
            <div className="h-96 flex items-center justify-center bg-card rounded-lg border">
              <p className="text-muted-foreground">Reports and analytics module coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground pt-4 border-t border-rune-secondary/50">
        <p>© 2025 Rutgers University Network Evaluator (RUNE) • Dashboard v1.0.0</p>
      </footer>
    </div>
  );
}
