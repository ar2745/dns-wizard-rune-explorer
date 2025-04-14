
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface DNSFormProps {
  onSubmit: (formData: DNSFormData) => void;
  isLoading: boolean;
}

export interface DNSFormData {
  domain: string;
  ipAddress: string;
  allRecordTypes: boolean;
  spf: boolean;
  dmarc: boolean;
  dkim: boolean;
  recursive: boolean;
  debugMode: boolean;
  resourceTypes: string;
}

export function DNSForm({ onSubmit, isLoading }: DNSFormProps) {
  const [formData, setFormData] = useState<DNSFormData>({
    domain: "",
    ipAddress: "",
    allRecordTypes: false,
    spf: false,
    dmarc: false,
    dkim: false,
    recursive: false,
    debugMode: false,
    resourceTypes: "",
  });
  
  const [errors, setErrors] = useState<{
    domain?: string;
    ipAddress?: string;
    resourceTypes?: string;
    options?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: {
      domain?: string;
      ipAddress?: string;
      resourceTypes?: string;
      options?: string;
    } = {};
    
    // Domain validation
    if (!formData.domain) {
      newErrors.domain = "Domain name is required";
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.domain)) {
      newErrors.domain = "Invalid domain format";
    }
    
    // IP validation (optional)
    if (formData.ipAddress && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.ipAddress)) {
      newErrors.ipAddress = "Invalid IP address format";
    }
    
    // Resource types validation
    if (formData.resourceTypes && !/^[A-Z\s]+$/.test(formData.resourceTypes)) {
      newErrors.resourceTypes = "Resource types should be uppercase letters (e.g., NS TXT A)";
    }
    
    // Logic conflict validation
    if (formData.allRecordTypes && formData.spf) {
      newErrors.options = "All Record Types and SPF cannot both be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="bg-gradient-to-r from-rune-primary to-rune-secondary">
        <CardTitle className="text-white">RUNE - Rutgers University Network Evaluator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name <span className="text-red-500">*</span></Label>
              <Input
                id="domain"
                name="domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={handleChange}
                className={errors.domain ? "border-red-500" : ""}
              />
              {errors.domain && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.domain}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address (Optional)</Label>
              <Input
                id="ipAddress"
                name="ipAddress"
                placeholder="192.168.1.1"
                value={formData.ipAddress}
                onChange={handleChange}
                className={errors.ipAddress ? "border-red-500" : ""}
              />
              {errors.ipAddress && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.ipAddress}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceTypes">DNS Resource Types (e.g., NS TXT A)</Label>
            <Input
              id="resourceTypes"
              name="resourceTypes"
              placeholder="NS TXT A"
              value={formData.resourceTypes}
              onChange={handleChange}
              className={errors.resourceTypes ? "border-red-500" : ""}
            />
            {errors.resourceTypes && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {errors.resourceTypes}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allRecordTypes" 
                name="allRecordTypes"
                checked={formData.allRecordTypes}
                onCheckedChange={(checked) => 
                  setFormData({...formData, allRecordTypes: checked === true})
                }
              />
              <Label htmlFor="allRecordTypes">All Records</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="spf" 
                name="spf"
                checked={formData.spf}
                onCheckedChange={(checked) => 
                  setFormData({...formData, spf: checked === true})
                }
              />
              <Label htmlFor="spf">SPF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dmarc" 
                name="dmarc"
                checked={formData.dmarc}
                onCheckedChange={(checked) => 
                  setFormData({...formData, dmarc: checked === true})
                }
              />
              <Label htmlFor="dmarc">DMARC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dkim" 
                name="dkim"
                checked={formData.dkim}
                onCheckedChange={(checked) => 
                  setFormData({...formData, dkim: checked === true})
                }
              />
              <Label htmlFor="dkim">DKIM</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recursive" 
                name="recursive"
                checked={formData.recursive}
                onCheckedChange={(checked) => 
                  setFormData({...formData, recursive: checked === true})
                }
              />
              <Label htmlFor="recursive">Recursive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="debugMode" 
                name="debugMode"
                checked={formData.debugMode}
                onCheckedChange={(checked) => 
                  setFormData({...formData, debugMode: checked === true})
                }
              />
              <Label htmlFor="debugMode">Debug Mode</Label>
            </div>
          </div>
          
          {errors.options && (
            <p className="text-sm text-red-500 flex items-center mt-2">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.options}
            </p>
          )}
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-rune-primary hover:bg-rune-primary/90"
            >
              {isLoading ? "Processing..." : "Run Query"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
