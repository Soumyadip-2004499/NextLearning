"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Mic, Activity, Clock, Wifi, Search, Sparkles } from "lucide-react";

/**
 * 1. DotMatrixDisplay
 * Digital Nothing OS style dot matrix text or counter
 */
export function DotMatrixDisplay({
  text,
  size = "md",
  className,
  dotRed = false,
}: {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  dotRed?: boolean;
}) {
  const sizeClasses = {
    sm: "text-xs tracking-wider",
    md: "text-sm sm:text-base tracking-widest",
    lg: "text-xl sm:text-2xl tracking-widest",
    xl: "text-3xl sm:text-5xl tracking-widest",
  };

  return (
    <span
      className={cn(
        "font-dot inline-flex items-center gap-2 uppercase select-none",
        sizeClasses[size],
        className
      )}
    >
      {dotRed && <span className="red-dot mr-1" />}
      {text}
    </span>
  );
}

/**
 * 2. GlyphBar
 * Minimal glowing light strip inspired by Nothing Phone's Glyph Interface
 */
export function GlyphBar({
  className,
  active = true,
  color = "red",
  activeIndex,
  total,
}: {
  className?: string;
  active?: boolean;
  color?: "red" | "white" | "teal";
  activeIndex?: number;
  total?: number;
}) {
  const colorMap = {
    red: "bg-[#eb0028] shadow-[0_0_12px_#eb0028]",
    white: "bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]",
    teal: "bg-[#00dc82] shadow-[0_0_12px_#00dc82]",
  };

  if (total && total > 1) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        {Array.from({ length: total }).map((_, i) => {
          const isSegActive = activeIndex !== undefined ? i <= activeIndex : active;
          return (
            <div
              key={i}
              className={cn(
                "h-1 w-3 rounded-full transition-all duration-300",
                isSegActive ? colorMap[color] : "bg-neutral-800"
              )}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-1 rounded-full transition-all duration-500",
        active ? colorMap[color] : "bg-neutral-800",
        className
      )}
    />
  );
}

/**
 * 3. VoiceSoundwave
 * Animated audio waveform visualizer for Nothing OS voice interaction
 */
export function VoiceSoundwave({
  isListening = true,
  className,
}: {
  isListening?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 h-8 px-3 rounded-2xl bg-card border border-border shadow-xs", className)}>
      <div className="flex items-center gap-1 h-6">
        {[40, 90, 60, 100, 75, 45, 80].map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-[#eb0028] transition-all duration-300"
            style={{
              height: isListening ? `${h}%` : "20%",
              animation: isListening
                ? `wave 1s ease-in-out infinite alternate ${i * 0.12}s`
                : "none",
            }}
          />
        ))}
      </div>
      <span className="font-dot text-[10px] uppercase text-muted-foreground tracking-widest ml-1">
        {isListening ? "AUDIO // LIVE" : "MIC // IDLE"}
      </span>
    </div>
  );
}

/**
 * 4. TelemetryWidget
 * Digital HUD showing Indian Standard Time, Date, and System status
 */
export function TelemetryWidget({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("00:00:00");
  const [dateStr, setDateStr] = useState<string>("NEXTLEARNING.OS");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border backdrop-blur-md text-xs text-muted-foreground font-mono shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="red-dot" />
        <span className="font-dot text-foreground tracking-widest">{time}</span>
        <span className="text-[10px] text-muted-foreground">// IST</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-mono">
          {dateStr}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
          <Wifi className="w-2.5 h-2.5" /> ONLINE
        </span>
      </div>
    </div>
  );
}

/**
 * 5. SegmentedMeter
 * Nothing OS style segmented dot/block gauge for percentage metrics
 */
export function SegmentedMeter({
  value = 75,
  max = 100,
  totalSegments = 12,
  className,
}: {
  value?: number;
  max?: number;
  totalSegments?: number;
  className?: string;
}) {
  const activeSegments = Math.round((Math.min(value, max) / max) * totalSegments);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: totalSegments }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-3 w-1.5 rounded-xs transition-all duration-300",
            i < activeSegments
              ? "bg-[#eb0028] shadow-[0_0_6px_rgba(235,0,40,0.6)]"
              : "bg-muted border border-border"
          )}
        />
      ))}
      <span className="font-dot text-xs text-foreground ml-2">
        {Math.round((value / max) * 100)}%
      </span>
    </div>
  );
}
