"use client";

import { useOffline } from "@/lib/offline/offline-provider";
import { Wifi, WifiOff, RefreshCw, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { isOnline, lastSyncedAt, syncQueue, isSyncing, syncNow } = useOffline();

  if (isOnline && syncQueue.length === 0) {
    return null; // Don't show anything when everything is fine
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
        !isOnline
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : isSyncing
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : syncQueue.length > 0
          ? "bg-teal-50 text-teal-700 border border-teal-200"
          : ""
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
          {lastSyncedAt && (
            <span className="opacity-70">
              · Last synced: {new Date(lastSyncedAt).toLocaleTimeString()}
            </span>
          )}
        </>
      ) : isSyncing ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Syncing changes…</span>
        </>
      ) : syncQueue.length > 0 ? (
        <>
          <Cloud className="h-3.5 w-3.5" />
          <span>{syncQueue.length} pending</span>
          <button
            onClick={() => syncNow()}
            className="underline hover:no-underline ml-1"
          >
            Sync now
          </button>
        </>
      ) : (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Connected</span>
        </>
      )}
    </div>
  );
}
