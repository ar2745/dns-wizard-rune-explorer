
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DNSFormData } from "./DNSForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DNSResultsProps {
  results: DNSResults | null;
  formData: DNSFormData;
}

export interface DNSResults {
  records: Record<string, DNSRecord[]>;
  warnings: DNSWarning[];
  errors: DNSError[];
}

interface DNSRecord {
  name: string;
  type: string;
  value: string;
  ttl?: number;
  priority?: number;
}

interface DNSWarning {
  type: "info" | "warning" | "error";
  message: string;
  detail?: string;
}

interface DNSError {
  type: "error";
  message: string;
  detail?: string;
}

export function DNSResults({ results, formData }: DNSResultsProps) {
  const [viewType, setViewType] = useState<"table" | "json">("table");

  if (!results) return null;

  const recordTypes = Object.keys(results.records);

  const renderAlertIcon = (type: "info" | "warning" | "error") => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const renderAlertClass = (type: "info" | "warning" | "error") => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">DNS Results</CardTitle>
            <CardDescription>
              Results for {formData.domain}{" "}
              {formData.ipAddress && `(${formData.ipAddress})`}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge 
              variant="outline" 
              className={viewType === "table" ? "bg-primary text-primary-foreground" : ""}
              onClick={() => setViewType("table")}
            >
              Table
            </Badge>
            <Badge 
              variant="outline" 
              className={viewType === "json" ? "bg-primary text-primary-foreground" : ""}
              onClick={() => setViewType("json")}
            >
              JSON
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={recordTypes[0] || "none"} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mb-4">
              {recordTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="text-sm">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            {recordTypes.map((type) => (
              <TabsContent key={type} value={type} className="mt-0">
                {viewType === "table" ? (
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>TTL</TableHead>
                          {type === "MX" && <TableHead>Priority</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.records[type].map((record, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{record.name}</TableCell>
                            <TableCell>{record.type}</TableCell>
                            <TableCell className="max-w-md break-all">
                              {record.value}
                            </TableCell>
                            <TableCell>{record.ttl}</TableCell>
                            {type === "MX" && (
                              <TableCell>{record.priority}</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(results.records[type], null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </TabsContent>
            ))}

            {recordTypes.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No records found</p>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {(results.warnings.length > 0 || results.errors.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Warnings & Errors</CardTitle>
            <CardDescription>
              Issues detected in DNS configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.warnings.map((warning, idx) => (
              <Alert 
                key={`warning-${idx}`} 
                className={renderAlertClass(warning.type)}
              >
                <div className="flex gap-2">
                  {renderAlertIcon(warning.type)}
                  <div>
                    <AlertTitle>{warning.message}</AlertTitle>
                    {warning.detail && (
                      <AlertDescription>{warning.detail}</AlertDescription>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
            
            {results.errors.map((error, idx) => (
              <Alert 
                key={`error-${idx}`} 
                className={renderAlertClass("error")}
              >
                <div className="flex gap-2">
                  {renderAlertIcon("error")}
                  <div>
                    <AlertTitle>{error.message}</AlertTitle>
                    {error.detail && (
                      <AlertDescription>{error.detail}</AlertDescription>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
