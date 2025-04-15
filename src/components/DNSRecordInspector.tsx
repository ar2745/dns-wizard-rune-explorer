
import { useState } from "react";
import { 
  Check, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Copy,
  Edit, 
  Filter,
  MoreHorizontal, 
  Search, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface DNSRecord {
  id: string;
  name: string;
  type: string;
  value: string;
  ttl: number;
  priority?: number;
  status: "propagated" | "pending" | "error";
  lastUpdated: string;
}

export function DNSRecordInspector() {
  const [selectedDomain, setSelectedDomain] = useState("rutgers.edu");
  const [searchTerm, setSearchTerm] = useState("");
  const [recordType, setRecordType] = useState("all");
  
  // Mock data for DNS records
  const records: DNSRecord[] = [
    {
      id: "1",
      name: "rutgers.edu",
      type: "A",
      value: "128.6.81.150",
      ttl: 3600,
      status: "propagated",
      lastUpdated: "2025-04-14T10:00:00Z"
    },
    {
      id: "2",
      name: "rutgers.edu",
      type: "MX",
      value: "mta.rutgers.edu",
      priority: 10,
      ttl: 3600,
      status: "propagated",
      lastUpdated: "2025-04-14T10:00:00Z"
    },
    {
      id: "3",
      name: "rutgers.edu",
      type: "NS",
      value: "ns1.rutgers.edu",
      ttl: 86400,
      status: "propagated",
      lastUpdated: "2025-04-13T15:30:00Z"
    },
    {
      id: "4",
      name: "rutgers.edu",
      type: "NS",
      value: "ns2.rutgers.edu",
      ttl: 86400,
      status: "propagated",
      lastUpdated: "2025-04-13T15:30:00Z"
    },
    {
      id: "5",
      name: "www.rutgers.edu",
      type: "CNAME",
      value: "rutgers.edu",
      ttl: 3600,
      status: "propagated",
      lastUpdated: "2025-04-14T09:45:00Z"
    },
    {
      id: "6",
      name: "rutgers.edu",
      type: "TXT",
      value: "v=spf1 ip4:128.6.0.0/16 ip4:114.122.0.0/16 include:_spf.google.com ~all",
      ttl: 3600,
      status: "propagated",
      lastUpdated: "2025-04-14T10:15:00Z"
    },
    {
      id: "7",
      name: "_dmarc.rutgers.edu",
      type: "TXT",
      value: "v=DMARC1; p=reject; rua=mailto:dmarc@rutgers.edu; ruf=mailto:forensics@rutgers.edu",
      ttl: 3600,
      status: "propagated",
      lastUpdated: "2025-04-14T10:20:00Z"
    },
    {
      id: "8",
      name: "mail._domainkey.rutgers.edu",
      type: "TXT",
      value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAO...",
      ttl: 3600,
      status: "pending",
      lastUpdated: "2025-04-15T08:30:00Z"
    }
  ];
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.value.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = recordType === 'all' || record.type === recordType;
    
    return matchesSearch && matchesType;
  });
  
  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "Record value has been copied to your clipboard",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">DNS Record Inspector</CardTitle>
        <div className="flex items-center space-x-2">
          <Select defaultValue={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rutgers.edu">rutgers.edu</SelectItem>
              <SelectItem value="admissions.rutgers.edu">admissions.rutgers.edu</SelectItem>
              <SelectItem value="cs.rutgers.edu">cs.rutgers.edu</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            History
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search records..." 
                  className="pl-10 w-full md:w-60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="A">A Records</SelectItem>
                  <SelectItem value="AAAA">AAAA Records</SelectItem>
                  <SelectItem value="CNAME">CNAME Records</SelectItem>
                  <SelectItem value="MX">MX Records</SelectItem>
                  <SelectItem value="TXT">TXT Records</SelectItem>
                  <SelectItem value="NS">NS Records</SelectItem>
                  <SelectItem value="SRV">SRV Records</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm">
              <ChevronDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[350px]">Value</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-muted/50">{record.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[350px]">
                      <div className="font-mono text-sm truncate" title={record.value}>
                        {record.value}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{record.ttl}s</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {record.status === "propagated" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Propagated
                          </Badge>
                        )}
                        {record.status === "pending" && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {record.status === "error" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                            Error
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(record.lastUpdated)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCopyValue(record.value)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy value
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit record
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No records found</p>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {records.length} records</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
