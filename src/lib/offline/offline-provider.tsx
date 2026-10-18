"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface SyncQueueItem {
  id: string;
  action: string;
  endpoint: string;
  method: string;
  payload: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

interface OfflineContextType {
  isOnline: boolean;
  lastSyncedAt: string | null;
  syncQueue: SyncQueueItem[];
  addToSyncQueue: (item: Omit<SyncQueueItem, "id" | "createdAt" | "retryCount">) => void;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const SYNC_QUEUE_KEY = "nextlearning_sync_queue";
const LAST_SYNCED_KEY = "nextlearning_last_synced";
const MAX_RETRIES = 3;

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    if (stored) {
      try {
        setSyncQueue(JSON.parse(stored));
      } catch {
        // Invalid stored data, reset
        localStorage.removeItem(SYNC_QUEUE_KEY);
      }
    }
    
    const lastSync = localStorage.getItem(LAST_SYNCED_KEY);
    setLastSyncedAt(lastSync);
  }, []);

  // Online/offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Persist sync queue
  useEffect(() => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      syncNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const addToSyncQueue = useCallback(
    (item: Omit<SyncQueueItem, "id" | "createdAt" | "retryCount">) => {
      const newItem: SyncQueueItem = {
        ...item,
        id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };
      setSyncQueue((prev) => [...prev, newItem]);
    },
    []
  );

  const syncNow = useCallback(async () => {
    if (isSyncing || !isOnline || syncQueue.length === 0) return;

    setIsSyncing(true);
    const remaining: SyncQueueItem[] = [];

    for (const item of syncQueue) {
      try {
        const response = await fetch(item.endpoint, {
          method: item.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload),
        });

        if (!response.ok) {
          if (item.retryCount < MAX_RETRIES) {
            remaining.push({ ...item, retryCount: item.retryCount + 1 });
          }
          // Drop after max retries
        }
      } catch {
        if (item.retryCount < MAX_RETRIES) {
          remaining.push({ ...item, retryCount: item.retryCount + 1 });
        }
      }
    }

    setSyncQueue(remaining);
    const now = new Date().toISOString();
    setLastSyncedAt(now);
    localStorage.setItem(LAST_SYNCED_KEY, now);
    setIsSyncing(false);
  }, [isSyncing, isOnline, syncQueue]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        lastSyncedAt,
        syncQueue,
        addToSyncQueue,
        syncNow,
        isSyncing,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider");
  }
  return context;
}
