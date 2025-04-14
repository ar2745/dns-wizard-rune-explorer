
import { useState } from "react";
import { DNSForm, DNSFormData } from "@/components/DNSForm";
import { DNSResults, DNSResults as DNSResultsType } from "@/components/DNSResults";
import { Loading } from "@/components/Loading";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [formData, setFormData] = useState<DNSFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DNSResultsType | null>(null);

  const handleFormSubmit = (data: DNSFormData) => {
    setFormData(data);
    setIsLoading(true);
    setResults(null);

    // Simulate API call to backend
    setTimeout(() => {
      setIsLoading(false);
      setResults(generateMockResults(data));
    }, 1500);
  };

  // This function generates mock DNS results for demonstration purposes
  // In a real application, this would be replaced with actual API calls to a Flask backend
  const generateMockResults = (data: DNSFormData): DNSResultsType => {
    const records: Record<string, any[]> = {};
    
    if (data.allRecordTypes || data.resourceTypes.includes("A")) {
      records["A"] = [
        { name: data.domain, type: "A", value: "192.0.2.1", ttl: 3600 },
        { name: `www.${data.domain}`, type: "A", value: "192.0.2.2", ttl: 3600 },
      ];
    }
    
    if (data.allRecordTypes || data.resourceTypes.includes("MX")) {
      records["MX"] = [
        { name: data.domain, type: "MX", value: `mail1.${data.domain}`, ttl: 3600, priority: 10 },
        { name: data.domain, type: "MX", value: `mail2.${data.domain}`, ttl: 3600, priority: 20 },
      ];
    }
    
    if (data.allRecordTypes || data.resourceTypes.includes("NS")) {
      records["NS"] = [
        { name: data.domain, type: "NS", value: `ns1.${data.domain}`, ttl: 86400 },
        { name: data.domain, type: "NS", value: `ns2.${data.domain}`, ttl: 86400 },
      ];
    }
    
    // SPF, DMARC, DKIM records (TXT records)
    if (data.allRecordTypes || data.resourceTypes.includes("TXT") || data.spf) {
      records["TXT"] = [
        { 
          name: data.domain, 
          type: "TXT", 
          value: "v=spf1 include:_spf.google.com include:sendgrid.net ~all", 
          ttl: 3600 
        },
      ];
    }
    
    if (data.dmarc) {
      if (!records["TXT"]) records["TXT"] = [];
      records["TXT"].push({ 
        name: `_dmarc.${data.domain}`, 
        type: "TXT", 
        value: "v=DMARC1; p=none; rua=mailto:dmarc@example.com", 
        ttl: 3600 
      });
    }
    
    if (data.dkim) {
      if (!records["TXT"]) records["TXT"] = [];
      records["TXT"].push({ 
        name: `selector1._domainkey.${data.domain}`, 
        type: "TXT", 
        value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrLHiExVd55zd/IQ/J1LmZ+XWXHBP92+/aYJDvftklqAd15FrP/mkP15uQMPY8gFiLmVEfUxXIPK7P5fy1ZdxiM/9tCbUtOgHXiR3JEeECOCpZB3UXIQzQvgdJnBcbqbdhmCfgNFIjPhtMnvSGqI2NHp3RjPCXPFjntidLvMKOsg==", 
        ttl: 3600 
      });
    }
    
    // Generate some warnings and errors for demonstration
    const warnings = [];
    const errors = [];
    
    if (data.spf) {
      warnings.push({
        type: "warning",
        message: "SPF record uses deprecated syntax",
        detail: "Consider updating to include mechanism instead of a mechanism"
      });
    }
    
    if (data.dmarc) {
      warnings.push({
        type: "info",
        message: "DMARC policy set to 'none'",
        detail: "This is only monitoring mode. Consider using 'quarantine' or 'reject' for better security."
      });
    }
    
    if (data.dkim) {
      errors.push({
        type: "error",
        message: "DKIM record not found or invalid",
        detail: "Could not locate valid DKIM record for default selector"
      });
    }
    
    return {
      records,
      warnings,
      errors
    };
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rune-primary to-rune-secondary">
              RUNE
            </h1>
            <p className="text-muted-foreground">
              Rutgers University Network Evaluator
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="space-y-8">
          <DNSForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {isLoading && <Loading />}
          
          {!isLoading && results && (
            <DNSResults results={results} formData={formData!} />
          )}
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Rutgers University Network Evaluator (RUNE)</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
