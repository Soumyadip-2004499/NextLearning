"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Check, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ChipOption {
  label: string;
  value: string;
  description?: string;
}

interface ChipSelectProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  allowCustom?: boolean;
  customPlaceholder?: string;
  className?: string;
}

export function ChipSelect({
  options,
  selected = [],
  onChange,
  maxSelect,
  allowCustom = true,
  customPlaceholder = "Add another topic / skill...",
  className,
}: ChipSelectProps) {
  const [customInput, setCustomInput] = useState("");
  const [customList, setCustomList] = useState<ChipOption[]>([]);
  const [showMaxAlert, setShowMaxAlert] = useState(false);

  // Combine standard options with dynamically added custom options
  const allOptions = [...options, ...customList];

  const handleToggle = (value: string) => {
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
      setShowMaxAlert(false);
    } else {
      if (maxSelect && selected.length >= maxSelect) {
        setShowMaxAlert(true);
        setTimeout(() => setShowMaxAlert(false), 3000);
        return;
      }
      onChange([...selected, value]);
      setShowMaxAlert(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    // Check if it already exists
    const exists = allOptions.some(
      (opt) => opt.value.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      const newOption: ChipOption = { label: trimmed, value: trimmed };
      setCustomList((prev) => [...prev, newOption]);
    }

    // Automatically select it if under max limit
    if (!selected.includes(trimmed)) {
      if (maxSelect && selected.length >= maxSelect) {
        setShowMaxAlert(true);
        setTimeout(() => setShowMaxAlert(false), 3000);
      } else {
        onChange([...selected, trimmed]);
      }
    }

    setCustomInput("");
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {maxSelect && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Select up to {maxSelect} options</span>
          <span
            className={cn(
              "font-medium",
              selected.length >= maxSelect ? "text-amber-600 font-semibold" : ""
            )}
          >
            {selected.length} / {maxSelect} selected
          </span>
        </div>
      )}

      {showMaxAlert && maxSelect && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>You can select a maximum of {maxSelect} options for this step.</span>
        </motion.div>
      )}

      {/* Grid of Chips */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {allOptions.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <motion.button
              key={option.value}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleToggle(option.value)}
              className={cn(
                "relative group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left duration-200 select-none shadow-sm cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none border border-indigo-600 dark:bg-indigo-600"
                  : "bg-card text-foreground border border-border/80 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80"
              )}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "border border-muted-foreground/40 group-hover:border-indigo-400"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Option Input */}
      {allowCustom && (
        <form onSubmit={handleAddCustom} className="pt-2">
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={customPlaceholder}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="h-10 text-sm bg-background/80 rounded-xl pr-8"
              />
              {customInput && (
                <button
                  type="button"
                  onClick={() => setCustomInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={!customInput.trim()}
              className="h-10 px-3.5 rounded-xl border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-950 shrink-0 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChipSelect;
