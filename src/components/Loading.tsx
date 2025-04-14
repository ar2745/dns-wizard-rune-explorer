
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Processing DNS query..." }: LoadingProps) {
  return (
    <div className="h-60 w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-rune-primary border-r-transparent border-b-rune-secondary border-l-transparent animate-spin"></div>
        <Loader2 className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse text-rune-accent" />
      </div>
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">This might take a moment...</p>
    </div>
  );
}
