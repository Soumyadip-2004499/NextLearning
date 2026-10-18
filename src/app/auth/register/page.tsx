"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GlyphBar } from "@/components/ui/nothing-elements";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name cannot exceed 80 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["STUDENT", "FACILITATOR"]),
    language: z.string().min(2, "Please select a language"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
      language: "en",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          language: data.language,
          termsAccepted: data.termsAccepted,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to sign in...");

      // Redirect to login page on success after a short pause
      setTimeout(() => {
        router.push("/auth/login?registered=true");
      }, 1200);
    } catch (err) {
      console.error("Registration request failed:", err);
      setErrorMessage("Network error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background dot-bg px-4 py-12 sm:px-6 lg:px-8 text-foreground">
      <div className="w-full max-w-lg">
        {/* Telemetry Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-foreground backdrop-blur-md mb-4 font-mono text-[10px]">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82]" />
            <span className="font-dot uppercase tracking-widest">ACCESS // REGISTER.NODE</span>
          </div>
          <GlyphBar activeIndex={1} total={4} />
        </div>

        <div className="rounded-[28px] border border-border bg-card text-card-foreground backdrop-blur-xl p-7 sm:p-8 shadow-2xl">
          <div className="space-y-2 pb-6 text-center">
            {/* Hardware Glyph Indicator */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-foreground shadow-xl">
              <GraduationCap className="h-7 w-7 text-[#00dc82]" />
            </div>

            <div className="space-y-1 pt-2">
              <h1 className="font-dot text-2xl font-bold uppercase tracking-wider text-foreground">
                Join NextLearning // Node
              </h1>
              <p className="font-mono text-xs text-muted-foreground">
                Initialize your student or facilitator account in rural India.
              </p>
            </div>
          </div>

          <div className="space-y-5">
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5 font-mono text-xs">
                <Label htmlFor="name" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                  Full Name //
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Soumyadip Chattopadhyay"
                    className="pl-10 bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
                    disabled={isLoading}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-[#eb0028]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
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
                    placeholder="name@example.com"
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

              {/* Role Selection & Language Selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
                {/* Role Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" />
                    <span>Role //</span>
                  </Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="role" className="bg-muted/50 border-border text-foreground rounded-xl">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-card-foreground">
                          <SelectItem value="STUDENT">Student Node</SelectItem>
                          <SelectItem value="FACILITATOR">Facilitator / Mentor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-xs text-[#eb0028]">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Preferred Language */}
                <div className="space-y-1.5">
                  <Label htmlFor="language" className="text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3 w-3" />
                    <span>Language //</span>
                  </Label>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="language" className="bg-muted/50 border-border text-foreground rounded-xl">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-card-foreground">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                          <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                          <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                          <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                          <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                          <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.language && (
                    <p className="text-xs text-[#eb0028]">
                      {errors.language.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-mono text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                    Password //
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="pl-10 pr-9 bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                    Confirm Password //
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="pl-10 pr-9 bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
                      disabled={isLoading}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-[#eb0028]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Acceptance Checkbox */}
              <div className="pt-2">
                <Controller
                  control={control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <div className="flex items-start space-x-2.5">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="mt-0.5 border-border data-[state=checked]:bg-[#00dc82] data-[state=checked]:text-black"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="terms"
                          className="text-xs text-muted-foreground font-mono cursor-pointer"
                        >
                          I agree to NextLearning&apos;s Terms of Service and acknowledge the privacy safeguards.
                        </Label>
                      </div>
                    </div>
                  )}
                />
                {errors.termsAccepted && (
                  <p className="mt-1 text-xs text-[#eb0028] font-mono">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
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
                    <span className="keep-white">REGISTERING NODE...</span>
                  </>
                ) : (
                  <>
                    <span className="keep-white">CREATE ACCOUNT //</span>
                    <ArrowRight className="h-4 w-4 ml-1.5 keep-white" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="flex flex-col space-y-3 pt-6 text-center font-mono text-xs border-t border-border mt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-foreground hover:text-[#00dc82] transition-colors"
              >
                SIGN IN HERE //
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
    </div>
  );
}
