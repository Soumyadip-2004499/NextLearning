import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in-50 duration-300">
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-muted/60 border border-border flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-[#eb0028] animate-ping" />
        </div>
        <div className="absolute inset-0 rounded-3xl border border-[#eb0028]/30 animate-pulse pointer-events-none" />
      </div>

      <div className="text-center space-y-2">
        <div className="font-dot text-sm font-semibold tracking-widest text-foreground uppercase">
          NEXTLEARNING // INITIALIZING
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          ESTABLISHING SECURE PROTOCOL · STREAMING POSTGRES DATA
        </div>
      </div>

      <div className="h-1 w-48 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-[#eb0028] animate-[shimmer_1.5s_infinite] w-1/2 rounded-full" />
      </div>
    </div>
  );
}
