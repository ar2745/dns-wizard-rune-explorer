
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Copy, ExternalLink, HelpCircle, Info, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ValidationResult {
  type: "spf" | "dkim" | "dmarc";
  domain: string;
  value: string;
  hasRecord: boolean;
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
    detail?: string;
  }>;
  recommendations: string[];
}

export function SecurityValidator() {
  // Mock validation results
  const validations: ValidationResult[] = [
    {
      type: "spf",
      domain: "rutgers.edu",
      value: "v=spf1 ip4:128.6.0.0/16 ip4:114.122.0.0/16 include:_spf.google.com ~all",
      hasRecord: true,
      issues: [
        { 
          type: "warning", 
          message: "Soft fail policy used", 
          detail: "Using '~all' is less secure than '-all'"
        }
      ],
      recommendations: [
        "Consider using '-all' instead of '~all' to increase security",
        "Add SPF flattening to avoid exceeding the 10 DNS lookup limit"
      ]
    },
    {
      type: "dkim",
      domain: "rutgers.edu",
      value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAO...",
      hasRecord: true,
      issues: [],
      recommendations: [
        "Consider adding a backup DKIM selector",
        "Schedule periodic key rotation"
      ]
    },
    {
      type: "dmarc",
      domain: "rutgers.edu",
      value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@rutgers.edu; ruf=mailto:forensics@rutgers.edu; pct=100",
      hasRecord: true,
      issues: [
        { 
          type: "info", 
          message: "Policy not set to reject", 
          detail: "Using 'p=quarantine' instead of 'p=reject'"
        },
        {
          type: "warning",
          message: "Multiple reporting addresses",
          detail: "Consider consolidating report addresses"
        }
      ],
      recommendations: [
        "Consider moving to 'p=reject' after monitoring results",
        "Add subdomain policy with 'sp=reject'"
      ]
    }
  ];
  
  const getStatusIcon = (validation: ValidationResult) => {
    const errorCount = validation.issues.filter(i => i.type === "error").length;
    const warningCount = validation.issues.filter(i => i.type === "warning").length;
    
    if (!validation.hasRecord) {
      return <ShieldX className="h-5 w-5 text-red-500" />;
    } else if (errorCount > 0) {
      return <ShieldAlert className="h-5 w-5 text-red-500" />;
    } else if (warningCount > 0) {
      return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
    } else {
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
  };
  
  const getStatusBadge = (validation: ValidationResult) => {
    const errorCount = validation.issues.filter(i => i.type === "error").length;
    const warningCount = validation.issues.filter(i => i.type === "warning").length;
    
    if (!validation.hasRecord) {
      return (
        <Badge variant="destructive">Missing</Badge>
      );
    } else if (errorCount > 0) {
      return (
        <Badge variant="destructive">Issues Found</Badge>
      );
    } else if (warningCount > 0) {
      return (
        <Badge variant="warning" className="bg-yellow-500">Warnings</Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      );
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Record value has been copied to your clipboard",
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-rune-primary" />
          Email Security Validator
        </CardTitle>
        <CardDescription>
          Validate SPF, DKIM, and DMARC records for your domain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spf">
          <TabsList className="mb-4">
            <TabsTrigger value="spf">SPF</TabsTrigger>
            <TabsTrigger value="dkim">DKIM</TabsTrigger>
            <TabsTrigger value="dmarc">DMARC</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          {validations.map((validation) => (
            <TabsContent key={validation.type} value={validation.type} className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {getStatusIcon(validation)}
                    {validation.type.toUpperCase()} Record
                    {getStatusBadge(validation)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{validation.domain}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(validation.value)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Record
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{validation.value}</pre>
              </div>
              
              {validation.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Issues</h4>
                  {validation.issues.map((issue, i) => (
                    <div key={i} className={`
                      p-3 rounded-md flex items-start gap-3
                      ${issue.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : ''}
                      ${issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : ''}
                      ${issue.type === 'info' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                    `}>
                      {issue.type === 'error' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
                      {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
                      {issue.type === 'info' && <Info className="h-5 w-5 flex-shrink-0" />}
                      <div>
                        <div className="font-medium">{issue.message}</div>
                        {issue.detail && <div className="text-sm mt-1">{issue.detail}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  Recommendations
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validation.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {validations.map((validation) => (
                <Card key={validation.type} className="overflow-hidden">
                  <div className={`
                    h-1.5 w-full
                    ${validation.issues.filter(i => i.type === 'error').length > 0 ? 'bg-red-500' : ''}
                    ${validation.issues.filter(i => i.type === 'warning').length > 0 && validation.issues.filter(i => i.type === 'error').length === 0 ? 'bg-yellow-500' : ''}
                    ${validation.issues.length === 0 ? 'bg-green-500' : ''}
                  `}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center gap-2">
                      {getStatusIcon(validation)}
                      {validation.type.toUpperCase()}
                      {getStatusBadge(validation)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Issues: </span>
                        <span>
                          {validation.issues.filter(i => i.type === 'error').length} errors, {' '}
                          {validation.issues.filter(i => i.type === 'warning').length} warnings
                        </span>
                      </div>
                      <div>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Score</CardTitle>
                <CardDescription>Overall email security posture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-green-500" 
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>80/100</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Good</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your email security setup is good, but there are a few improvements that could make it excellent.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
