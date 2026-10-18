"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  UserCheck,
  Radio,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlyphBar } from "@/components/ui/nothing-elements";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");
  const isRegistered = searchParams.get("registered") === "true";

  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    urlError ? "Invalid credentials or session expired. Please sign in again." : null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    isRegistered ? "Account created successfully! Please sign in with your credentials." : null
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error || "Invalid email or password. Please verify your credentials."
        );
        setIsLoading(false);
        return;
      }

      // Check destination:
      // If a specific non-dashboard callbackUrl was provided (e.g. /facilitator or /roadmap), use it
      // Otherwise route according to role:
      const targetDestination =
        callbackUrl && callbackUrl !== "/dashboard"
          ? callbackUrl
          : result.redirectTo || (result.user.role === "FACILITATOR" ? "/facilitator" : "/dashboard");

      router.push(targetDestination);
      router.refresh();
    } catch (err) {
      console.error("Sign-in failure:", err);
      setErrorMessage("Could not connect to authentication service. Please try again.");
      setIsLoading(false);
    }
  };

  const fillDemoAccount = async (email: string, pass: string, autoSubmit = false) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setErrorMessage(null);

    if (autoSubmit) {
      await onSubmit({ email, password: pass });
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Telemetry Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-foreground backdrop-blur-md mb-4 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#eb0028] shadow-[0_0_8px_#eb0028]" />
          <span className="font-dot uppercase tracking-widest font-semibold">ACCESS // TERMINAL.LOGIN</span>
        </div>
        <GlyphBar activeIndex={2} total={4} />
      </div>

      <div className="rounded-[28px] border border-border bg-card text-card-foreground backdrop-blur-xl p-7 sm:p-8 shadow-2xl">
        <div className="space-y-2 pb-6 text-center">
          {/* Hardware Glyph Indicator */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-foreground shadow-xl">
            <GraduationCap className="h-7 w-7 text-[#eb0028]" />
          </div>

          <div className="space-y-1 pt-2">
            <h1 className="font-dot text-2xl font-bold uppercase tracking-wider text-foreground">
              NextLearning // Terminal
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Sign in to resume your learning and livelihood roadmap.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Success Message Alert */}
          {successMessage && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-[#00dc82]/30 bg-[#00dc82]/10 p-3.5 text-xs font-mono text-[#00dc82]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 uppercase tracking-wider font-semibold">{successMessage}</div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-[#eb0028]/30 bg-[#eb0028]/10 p-3.5 text-xs font-mono text-[#eb0028]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 uppercase tracking-wider font-semibold">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5 font-mono text-xs">
              <Label htmlFor="email" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Email Address //
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@example.com"
                  className="pl-10 bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#eb0028]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <Label htmlFor="password" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Password //
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#eb0028]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="red"
              className="w-full font-mono text-xs uppercase tracking-wider py-6 shadow-[0_0_25px_rgba(235,0,40,0.3)] cursor-pointer keep-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 keep-white" />
                  <span className="keep-white">AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span className="keep-white">INITIALIZE SESSION //</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 keep-white" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials Box */}
          <div className="rounded-2xl border border-border bg-muted/50 p-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 pb-2 text-[11px] text-foreground font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82]" />
              <span className="font-dot uppercase tracking-widest">ONE-CLICK EVALUATION LOGINS</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select a pre-seeded account to evaluate the platform:
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("demo@student.com", "demo1234", true)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted hover:border-[#00dc82]/40 text-foreground text-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-[#00dc82]" />
                  <span className="font-medium text-foreground">Student (Soumyadip Chattopadhyay)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">demo@student.com</span>
                  <span className="text-[9px] uppercase tracking-wider bg-[#00dc82]/15 text-[#00dc82] border border-[#00dc82]/30 px-1.5 py-0.5 rounded">SIGN IN ➔</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("demo@teacher.com", "demo1234", true)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted hover:border-sky-400/40 text-foreground text-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-sky-400" />
                  <span className="font-medium text-foreground">Facilitator (G. Sai Kavya)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">demo@teacher.com</span>
                  <span className="text-[9px] uppercase tracking-wider bg-sky-400/15 text-sky-400 border border-sky-400/30 px-1.5 py-0.5 rounded">SIGN IN ➔</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-6 text-center font-mono text-xs border-t border-border mt-6">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-foreground hover:text-[#eb0028] transition-colors"
            >
              REGISTER HERE //
            </Link>
          </p>
          <Link
            href="/"
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to NextLearning Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background dot-bg px-4 py-12 sm:px-6 lg:px-8 text-foreground">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-card-foreground">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#eb0028]" />
              <p className="text-xs font-mono text-muted-foreground">INITIALIZING AUTH...</p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
