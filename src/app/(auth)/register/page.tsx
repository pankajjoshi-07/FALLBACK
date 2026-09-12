"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import {
  Sparkles,
  Eye,
  EyeOff,
  Shield,
  BookOpen,
  Heart,
  MessageSquare,
  Wrench,
  Loader2,
  MailCheck,
} from "lucide-react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [displayName, setDisplayName] = useState("");
  const [heroName, setHeroName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClass, setSelectedClass] = useState<"Warrior" | "Scholar" | "Monk" | "Bard" | "Artisan">("Warrior");
  const [activityTimezone, setActivityTimezone] = useState("UTC");

  // Verification step state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setActivityTimezone(tz);
    } catch {
      // Fallback UTC
    }
  }, []);

  const classes = [
    {
      id: "Warrior" as const,
      name: "Fitness & Health",
      archetype: "Warrior",
      icon: <Shield className="w-4 h-4 text-red-400" aria-hidden="true" />,
      desc: "Physical workouts, stamina, strength training, and nutrition.",
    },
    {
      id: "Scholar" as const,
      name: "Learning & Career",
      archetype: "Scholar",
      icon: <BookOpen className="w-4 h-4 text-blue-400" aria-hidden="true" />,
      desc: "Studying, reading, programming, and intellectual growth.",
    },
    {
      id: "Monk" as const,
      name: "Mindfulness & Wellness",
      archetype: "Monk",
      icon: <Heart className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      desc: "Meditation, sleep schedule, stress management, and daily routines.",
    },
    {
      id: "Bard" as const,
      name: "Social & Communication",
      archetype: "Bard",
      icon: <MessageSquare className="w-4 h-4 text-purple-400" aria-hidden="true" />,
      desc: "Public speaking, networking, relationships, and collaboration.",
    },
    {
      id: "Artisan" as const,
      name: "Creative & Projects",
      archetype: "Artisan",
      icon: <Wrench className="w-4 h-4 text-gold" aria-hidden="true" />,
      desc: "Building side projects, creative writing, art, and craft.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters in length.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: displayName.trim(),
        unsafeMetadata: {
          heroName: (heroName.trim() || displayName.trim()),
          className: selectedClass,
          activityTimezone,
        },
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else if (result.status === "missing_requirements") {
        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      } else {
        setError("Account created. Please check your email or proceed to login.");
      }
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          "Failed to forge hero record."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Clerk verification status:", completeSignUp);
        setError("Verification incomplete. Please check the code and try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          "Invalid verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-page">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full rounded-2xl border border-border bg-panel p-8 shadow-panel relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-gold font-heading font-bold text-xl tracking-wider hover:opacity-90 transition-opacity">
            <Sparkles className="w-5 h-5" />
            Arcane Codex
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {pendingVerification ? "Verify Your Arcane Signal" : "Create Account"}
          </h1>
          <p className="text-xs text-foreground-muted">
            {pendingVerification
              ? `We sent a verification code to ${email}. Enter it below to awaken your character.`
              : "Create your Life RPG account and turn real-life habits into leveling progress."}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 font-medium" role="alert">
            {error}
          </div>
        )}

        {pendingVerification ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verify-code" className="block text-xs font-semibold text-foreground mb-1">
                6-Digit Verification Code
              </label>
              <input
                id="verify-code"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                aria-label="Verification code"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-center tracking-widest text-lg font-mono focus:border-gold outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !verificationCode.trim()}
              aria-label="Confirm verification code"
              className="w-full py-3 px-4 rounded-xl bg-gold text-page font-heading font-bold text-sm hover:bg-gold/90 transition-transform active:scale-95 shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MailCheck className="w-4 h-4" />}
              <span>{isLoading ? "Attuning..." : "Complete Registration"}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setPendingVerification(false)}
                className="text-xs text-foreground-muted hover:text-gold transition-colors"
              >
                Back to registration details
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* OAuth Social Buttons (Google, Meta, Apple, LinkedIn) */}
            <OAuthButtons mode="signUp" onError={(msg) => setError(msg || null)} />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-display-name" className="block text-xs font-semibold text-foreground mb-1">
                    Display Name *
                  </label>
                  <input
                    id="reg-display-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex"
                    aria-label="Display name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    aria-label="Email address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-foreground mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    aria-label="Password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Focus Area Selection (Hybrid Life Goal & Archetype) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label id="focus-area-label" className="block text-xs font-semibold text-foreground">
                    Primary Focus Area <span className="text-foreground-muted font-normal">(Starting Archetype)</span>
                  </label>
                  <span className="text-[10px] text-foreground-muted">
                    You can still track all habit categories
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-labelledby="focus-area-label"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
                >
                  {classes.map((c) => {
                    const isSelected = selectedClass === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedClass(c.id)}
                        aria-label={`Select ${c.name} focus with ${c.archetype} archetype`}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-1.5",
                          isSelected
                            ? "border-gold bg-secondary ring-1 ring-gold shadow-glow"
                            : "border-border bg-secondary/50 hover:bg-secondary hover:border-border-bright"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                            {c.icon}
                            <span>{c.name}</span>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
                              isSelected
                                ? "bg-gold/20 text-gold border border-gold/40"
                                : "bg-panel text-foreground-muted border border-border"
                            )}
                          >
                            {c.archetype}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-muted leading-snug">
                          {c.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border text-[11px] text-foreground-muted">
                Activity Timezone: <strong className="text-foreground">{activityTimezone}</strong> (auto-detected).
                This timezone anchors your daily calendar days and streak multipliers.
              </div>

              {/* Clerk Bot Protection CAPTCHA Widget */}
              <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" className="flex justify-center" />

              <button
                type="submit"
                disabled={isLoading || !isLoaded}
                aria-label="Create account and get started"
                className="w-full py-3 px-4 rounded-xl bg-gold text-page font-heading font-bold text-sm hover:bg-gold/90 transition-transform active:scale-95 shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? "Forging Hero Record..." : "Create Account"}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-border/60">
              <p className="text-xs text-foreground-muted">
                Already have an account?{" "}
                <Link href="/login" className="text-gold font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
