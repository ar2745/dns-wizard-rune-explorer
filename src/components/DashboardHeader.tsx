
import { useState } from "react";
import { Bell, Info, PlusCircle, Search, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const [alerts, setAlerts] = useState(3);
  
  return (
    <header className="flex justify-between items-center mb-6 pb-4 border-b border-rune-secondary/50">
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rune-primary to-rune-primary/70">
          RUNE
        </h1>
        <p className="text-muted-foreground flex items-center">
          Rutgers University Network Evaluator
          <Info className="ml-1 h-4 w-4 text-muted-foreground/50 cursor-help" />
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search domains..." 
            className="pl-10 h-10 w-64 rounded-full bg-background border-border focus:border-rune-primary focus:ring-1 focus:ring-rune-primary/50 text-sm"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {alerts > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rune-primary text-white text-xs flex items-center justify-center">
              {alerts}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>User Profile</DropdownMenuItem>
            <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ThemeToggle />
        
        <Button size="sm" className="hidden md:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Domain
        </Button>
      </div>
    </header>
  );
}
