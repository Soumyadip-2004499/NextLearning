"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ONBOARDING_STEPS } from "@/data/onboarding-steps";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { ChipSelect } from "@/components/onboarding/chip-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Compass,
  Trophy,
  HelpCircle,
  Edit2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormState {
  displayName: string;
  educationLevel: string;
  state: string;
  district: string;
  favoriteSubjects: string[];
  interests: string[];
  hobbies: string[];
  skills: string[];
  careerPreference: string;
  careerAspirations: string[];
  learningStyle: string;
  availableHours: string;
  deviceAccess: string;
}

const initialFormState: FormState = {
  displayName: "",
  educationLevel: "",
  state: "",
  district: "",
  favoriteSubjects: [],
  interests: [],
  hobbies: [],
  skills: [],
  careerPreference: "",
  careerAspirations: [],
  learningStyle: "",
  availableHours: "7",
  deviceAccess: "smartphone",
};

export default function OnboardingPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalSteps = ONBOARDING_STEPS.length;
  const isReviewStep = currentStepIndex === totalSteps;
  const currentStep = !isReviewStep ? ONBOARDING_STEPS[currentStepIndex] : null;

  // Load existing profile if available
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const d = json.data;
            setFormData({
              displayName: d.displayName || "",
              educationLevel: d.educationLevel || "",
              state: d.state || "",
              district: d.district || "",
              favoriteSubjects: Array.isArray(d.favoriteSubjects) ? d.favoriteSubjects : [],
              interests: Array.isArray(d.interests) ? d.interests : [],
              hobbies: Array.isArray(d.hobbies) ? d.hobbies : [],
              skills: Array.isArray(d.skills) ? d.skills : [],
              careerPreference: d.careerPreference || "",
              careerAspirations: Array.isArray(d.careerAspirations) ? d.careerAspirations : [],
              learningStyle: d.learningStyle || "",
              availableHours: d.availableHours ? String(d.availableHours) : "7",
              deviceAccess: d.deviceAccess || "smartphone",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing profile:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadProfile();
  }, []);

  const handleNext = () => {
    setValidationError(null);

    if (currentStep?.required) {
      const field = currentStep.field as keyof FormState;
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        setValidationError("Please answer this question before continuing.");
        return;
      }
    }

    setDirection(1);
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    setValidationError(null);
    setDirection(1);
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleJumpToStep = (index: number) => {
    setValidationError(null);
    setDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setValidationError(null);

    try {
      const payload = {
        ...formData,
        availableHours: formData.availableHours ? Number(formData.availableHours) : 7,
        onboardingCompleted: true,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to complete onboarding");
      }

      setIsCompleted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving profile";
      setValidationError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: [0, 0, 0.2, 1] },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 1, 1] },
    }),
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-muted-foreground">
            Preparing your NextLearning onboarding...
          </p>
        </div>
      </div>
    );
  }

  // Celebration state
  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 p-4 text-white relative overflow-hidden">
        {/* Celebration Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                top: "50%",
                left: "50%",
                scale: 0,
                opacity: 1,
              }}
              animate={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: [0, 1.2, 0.8],
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
                ease: "easeOut",
              }}
              className={cn(
                "absolute w-3 h-3 rounded-full",
                i % 4 === 0 && "bg-teal-400",
                i % 4 === 1 && "bg-amber-400",
                i % 4 === 2 && "bg-indigo-400",
                i % 4 === 3 && "bg-emerald-400"
              )}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 text-center shadow-2xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/30 mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Welcome to NextLearning, {formData.displayName || "Friend"}!
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8">
            Your personalized learning-to-livelihood profile is all set. We have matched you with
            verified scholarships, government schemes, and tailored career pathways.
          </p>

          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => router.push("/opportunities")}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-6 rounded-2xl shadow-xl shadow-teal-500/20 text-base"
            >
              Explore Matching Opportunities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/opportunities/applications")}
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/15 py-6 rounded-2xl text-base"
            >
              Go to Application Tracker
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dot-bg flex flex-col justify-between py-6 px-4 sm:px-6 transition-colors duration-400">
      {/* Top Header & Progress */}
      <div className="max-w-2xl w-full mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border text-[#eb0028] shadow-md">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg text-foreground">
                Profile Setup // <span className="font-dot text-xs text-[#eb0028] tracking-widest">WIZARD</span>
              </span>
              <p className="text-xs font-mono text-muted-foreground">PERSONALIZED GUIDANCE SYSTEM</p>
            </div>
          </div>
          <span className="text-xs font-mono text-foreground bg-muted/60 px-3 py-1 rounded-full border border-border flex items-center gap-1.5">
            <span className="red-dot" />
            {isReviewStep ? "FINAL REVIEW" : `STEP 0${currentStepIndex + 1} / 0${totalSteps}`}
          </span>
        </div>

        <StepIndicator
          currentStep={currentStepIndex}
          totalSteps={totalSteps + 1}
          stepLabels={[...ONBOARDING_STEPS.map((s) => s.question), "Review & Confirm"]}
        />
      </div>

      {/* Main Interactive Card */}
      <div className="max-w-2xl w-full mx-auto my-6">
        <AnimatePresence mode="wait" custom={direction}>
          {!isReviewStep && currentStep ? (
            <motion.div
              key={currentStep.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <Card className="border border-border shadow-2xl rounded-[32px] bg-card text-card-foreground backdrop-blur-2xl overflow-hidden">
                <CardHeader className="pt-8 pb-4 px-6 sm:px-8">
                  <div className="flex items-center gap-2 mb-2 font-mono">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted border border-border text-foreground text-xs font-bold">
                      0{currentStepIndex + 1}
                    </span>
                    {currentStep.required ? (
                      <span className="text-[10px] uppercase tracking-wider text-[#eb0028] border border-[#eb0028]/30 bg-[#eb0028]/10 px-2 py-0.5 rounded-full">Required</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border bg-muted/50 px-2 py-0.5 rounded-full">Optional</span>
                    )}
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground leading-snug">
                    {currentStep.question}
                  </CardTitle>
                  {currentStep.description && (
                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-2 font-sans">
                      {currentStep.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="px-6 sm:px-8 py-4 space-y-4">
                  {/* Text Input Step */}
                  {currentStep.type === "text" && (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        autoFocus
                        value={(formData[currentStep.field as keyof FormState] as string) || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [currentStep.field]: e.target.value,
                          })
                        }
                        placeholder={`Enter your ${currentStep.id}...`}
                        className="h-14 text-base sm:text-lg px-4 rounded-2xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Select Step (Rendered as Friendly Radio / List for Touch) */}
                  {currentStep.type === "select" && (
                    <div className="grid gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {currentStep.options?.map((option) => {
                        const isSelected =
                          formData[currentStep.field as keyof FormState] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                [currentStep.field]: option.value,
                              });
                              setValidationError(null);
                            }}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl text-left border text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer",
                              isSelected
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-foreground/30 shadow-md keep-white"
                                : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted/50"
                            )}
                          >
                            <span className="pr-4">{option.label}</span>
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                                isSelected
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border"
                              )}
                            >
                              {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Chips / Multi-Select Step */}
                  {(currentStep.type === "chips" || currentStep.type === "multi-select") && (
                    <ChipSelect
                      options={currentStep.options || []}
                      selected={
                        (formData[currentStep.field as keyof FormState] as string[]) || []
                      }
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          [currentStep.field]: selected,
                        })
                      }
                      maxSelect={4}
                      allowCustom={true}
                      customPlaceholder="Type and add your own..."
                    />
                  )}

                  {validationError && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-2">
                      <HelpCircle className="w-4 h-4" />
                      {validationError}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border px-6 sm:px-8 py-5 mt-4 bg-muted/30">
                  <div>
                    {currentStepIndex > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        className="rounded-xl text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    ) : (
                      <span />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!currentStep.required && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSkip}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Skip for now
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl px-6 h-11 font-medium shadow-md keep-white"
                    >
                      <span className="keep-white">Next</span>
                      <ArrowRight className="w-4 h-4 ml-2 keep-white" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            /* Review Step */
            <motion.div
              key="review"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <Card className="border border-border shadow-xl rounded-3xl bg-card text-card-foreground backdrop-blur-sm overflow-hidden">
                <CardHeader className="pt-8 pb-4 px-6 sm:px-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00dc82]/15 text-[#00dc82] border border-[#00dc82]/30 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Almost Finished!
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Review Your NextLearning Profile
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                    Check your answers below. You can change any response before confirming.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 sm:px-8 py-4 space-y-4 max-h-[460px] overflow-y-auto">
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Full Name
                        </span>
                        <p className="text-base font-bold text-foreground mt-1">
                          {formData.displayName || "Not specified"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJumpToStep(0)}
                        className="self-end mt-2 h-7 px-2 text-xs text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Education Level
                        </span>
                        <p className="text-base font-bold text-foreground mt-1 capitalize">
                          {formData.educationLevel.replace("_", " ") || "Not specified"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJumpToStep(1)}
                        className="self-end mt-2 h-7 px-2 text-xs text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Location
                        </span>
                        <p className="text-base font-bold text-foreground mt-1">
                          {[formData.district, formData.state].filter(Boolean).join(", ") ||
                            "Not specified"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJumpToStep(2)}
                        className="self-end mt-2 h-7 px-2 text-xs text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Career Goal Preference
                        </span>
                        <p className="text-base font-bold text-foreground mt-1 capitalize">
                          {formData.careerPreference || "Flexible / Exploring"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJumpToStep(8)}
                        className="self-end mt-2 h-7 px-2 text-xs text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>

                  {/* Summary of Array Badges */}
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Curious Fields & Interests
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleJumpToStep(5)}
                          className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.interests.length > 0 ? (
                          formData.interests.map((item) => (
                            <span
                              key={item}
                              className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border font-medium capitalize"
                            >
                              {item.replace("_", " ")}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None selected</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Current Confident Skills
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleJumpToStep(7)}
                          className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.skills.length > 0 ? (
                          formData.skills.map((item) => (
                            <span
                              key={item}
                              className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border font-medium"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None selected</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Aspirations & Target Careers
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleJumpToStep(9)}
                          className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.careerAspirations.length > 0 ? (
                          formData.careerAspirations.map((item) => (
                            <span
                              key={item}
                              className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border font-medium"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {validationError && (
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-2">
                      <HelpCircle className="w-4 h-4" />
                      {validationError}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border px-6 sm:px-8 py-5 mt-4 bg-muted/30">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to questions
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl px-7 h-12 font-semibold shadow-lg keep-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin keep-white" />
                        <span className="keep-white">Saving Profile...</span>
                      </>
                    ) : (
                      <>
                        <span className="keep-white">Complete Profile & Launch</span>
                        <Send className="w-4 h-4 ml-2 keep-white" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer reassurance banner */}
      <div className="max-w-2xl w-full mx-auto text-center text-xs text-muted-foreground pb-2">
        <span>
          NextLearning respects student privacy. Your data is used exclusively to recommend public schemes,
          scholarships, and career paths.
        </span>
      </div>
    </div>
  );
}
