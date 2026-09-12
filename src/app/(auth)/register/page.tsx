"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Shield, BookOpen, Heart, MessageSquare, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [heroName, setHeroName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClass, setSelectedClass] = useState<"Warrior" | "Scholar" | "Monk" | "Bard" | "Artisan">("Warrior");
  const [activityTimezone, setActivityTimezone] = useState("UTC");
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
      label: "Warrior",
      icon: <Shield className="w-4 h-4 text-red-400" />,
      desc: "Champion of physical discipline and vitality.",
    },
    {
      id: "Scholar" as const,
      label: "Scholar",
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      desc: "Seeker of arcane knowledge, coding, and research.",
    },
    {
      id: "Monk" as const,
      label: "Monk",
      icon: <Heart className="w-4 h-4 text-emerald-400" />,
      desc: "Devotee of calm recovery, mindfulness, and habits.",
    },
    {
      id: "Bard" as const,
      label: "Bard",
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
      desc: "Maestro of charisma, networking, and articulation.",
    },
    {
      id: "Artisan" as const,
      label: "Artisan",
      icon: <Wrench className="w-4 h-4 text-gold" />,
      desc: "Creator of projects, craft, and tangible work.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError("Cipher must be at least 12 characters in length.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          heroName: (heroName.trim() || displayName.trim()),
          className: selectedClass,
          activityTimezone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error?.message || "Failed to forge hero record.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred during account creation.");
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
            Create Account
          </h1>
          <p className="text-xs text-foreground-muted">
            Create your Life RPG account and turn real-life habits into leveling progress.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 font-medium" role="alert">
            {error}
          </div>
        )}

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
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 12 characters"
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
            <span className="text-[10px] text-foreground-muted block mt-1">
              Must be at least 12 characters long and under 72 UTF-8 bytes.
            </span>
          </div>

          {/* Starter Class Selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Choose Your Starting Archetype (Class)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classes.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedClass(c.id)}
                  aria-label={`Select class ${c.label}`}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    selectedClass === c.id
                      ? "border-gold bg-secondary ring-1 ring-gold shadow-glow"
                      : "border-border bg-secondary/50 hover:bg-secondary hover:border-border-bright"
                  )}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground mb-0.5">
                    {c.icon}
                    <span>{c.label}</span>
                  </div>
                  <p className="text-[10px] text-foreground-muted line-clamp-1">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-secondary/30 border border-border text-[11px] text-foreground-muted">
            Activity Timezone: <strong className="text-foreground">{activityTimezone}</strong> (auto-detected).
            This timezone anchors your daily calendar days and streak multipliers.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-label="Create account and get started"
            className="w-full py-3 px-4 rounded-xl bg-gold text-page font-heading font-bold text-sm hover:bg-gold/90 transition-transform active:scale-95 shadow-glow disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
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
      </div>
    </div>
  );
}
