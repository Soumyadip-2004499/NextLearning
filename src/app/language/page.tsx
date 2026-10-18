"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Globe, Check, ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, type Language } from "@/data/languages";
import { cn } from "@/lib/utils";
import { GlyphBar } from "@/components/ui/nothing-elements";

export default function LanguageSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("en");

  const handleContinue = () => {
    // Store language preference
    localStorage.setItem("nextlearning_language", selected);
    localStorage.setItem("udaan_language", selected);
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen bg-background text-foreground dot-bg flex flex-col items-center justify-center p-4 transition-colors duration-400">
      {/* Telemetry Strip */}
      <div className="w-full max-w-lg flex items-center justify-between px-4 py-2.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md mb-6 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#eb0028] shadow-[0_0_8px_#eb0028]" />
          <span className="font-dot uppercase tracking-widest">LOCALE // MULTILINGUAL.BHARAT</span>
        </div>
        <GlyphBar activeIndex={0} total={4} />
      </div>

      <motion.div
        className="w-full max-w-lg rounded-[28px] border border-border bg-card/95 backdrop-blur-xl p-7 sm:p-8 shadow-2xl text-center transition-colors duration-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hardware Glyph Indicator */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border text-foreground shadow-xl mb-4">
          <Globe className="h-7 w-7 text-[#eb0028]" />
        </div>

        {/* Title */}
        <h1 className="font-dot text-2xl font-bold uppercase tracking-wider text-foreground mb-2">
          Choose Language //
        </h1>
        <p className="font-mono text-xs text-neutral-400 mb-6">
          अपनी भाषा चुनें · Select your preferred dialect &amp; tongue
        </p>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {SUPPORTED_LANGUAGES.map((lang: Language, index: number) => {
            const isSelected = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-foreground bg-foreground text-background shadow-sm font-bold"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50 shadow-xs"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#eb0028] shadow-[0_0_8px_#eb0028] block" />
                  </div>
                )}
                <span className="text-lg font-bold font-sans">{lang.nativeName}</span>
                <span className={cn("text-[10px] font-mono uppercase tracking-wider", isSelected ? "text-background/80" : "text-muted-foreground")}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button
          variant="red"
          size="lg"
          className="w-full font-mono text-xs uppercase tracking-wider py-6 shadow-[0_0_25px_rgba(235,0,40,0.3)] cursor-pointer keep-white"
          onClick={handleContinue}
        >
          <span className="keep-white">PROCEED TO REGISTRATION //</span>
          <ArrowRight className="h-4 w-4 ml-1.5 keep-white" />
        </Button>

        <p className="mt-4 text-[11px] font-mono text-muted-foreground">
          You can toggle your language preference anytime in the top status bar.
        </p>
      </motion.div>
    </div>
  );
}
