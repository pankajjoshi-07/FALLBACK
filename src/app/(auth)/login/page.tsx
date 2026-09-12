"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error?.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Unable to communicate with the authentication sanctuary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-page">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full rounded-2xl border border-border bg-panel p-8 shadow-panel relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-gold font-heading font-bold text-xl tracking-wider hover:opacity-90 transition-opacity">
            <Sparkles className="w-5 h-5" />
            Arcane Codex
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Enter the Sanctuary
          </h1>
          <p className="text-xs text-foreground-muted">
            Provide your adventurer credentials to reclaim your progress.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-foreground mb-1">
              Adventurer Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@arcanecodex.realm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-foreground mb-1">
              Secret Cipher
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gold text-page font-heading font-bold text-sm hover:bg-gold/90 transition-transform active:scale-95 shadow-glow disabled:opacity-50"
          >
            {isLoading ? "Consulting Codex..." : "Open Codex"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border/60">
          <p className="text-xs text-foreground-muted">
            New to the order?{" "}
            <Link href="/register" className="text-gold font-semibold hover:underline">
              Forge your hero account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
