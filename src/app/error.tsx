"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an unexpected error. Please try again, or contact support
        if the problem persists.
      </p>
      <Button onClick={reset} variant="default">
        <RefreshCw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}
