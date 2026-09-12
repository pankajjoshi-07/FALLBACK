"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Swords,
  Shield,
  Coins,
  Flame,
  CheckCircle2,
  Award,
  Scroll,
  ArrowRight,
  Heart,
  BookOpen,
  Compass,
  Check,
  Zap,
} from "lucide-react";
import { sound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  // Interactive preview simulator state (strictly client-side preview demo)
  const [simXp, setSimXp] = useState(0);
  const [simGold, setSimGold] = useState(0);
  const [simLevel, setSimLevel] = useState(1);
  const [simStreak, setSimStreak] = useState(1);
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  const sampleQuests = [
    { id: "q1", title: "Read 10 pages of focused non-fiction", attr: "INTELLECT", xp: 50, gold: 30, diff: "MEDIUM" },
    { id: "q2", title: "Take a brisk 20-minute movement walk", attr: "STRENGTH", xp: 25, gold: 15, diff: "EASY" },
    { id: "q3", title: "Complete priority task before noon", attr: "DISCIPLINE", xp: 50, gold: 30, diff: "MEDIUM" },
  ];

  const handleSimComplete = (q: (typeof sampleQuests)[number]) => {
    if (completedQuests[q.id]) return;

    sound.playQuestComplete();
    const newXp = simXp + q.xp;
    const newGold = simGold + q.gold;
    setSimXp(newXp);
    setSimGold(newGold);
    setCompletedQuests((prev) => ({ ...prev, [q.id]: true }));

    // Check level up (threshold 100)
    if (newXp >= 100 && simLevel === 1) {
      setSimLevel(2);
      sound.playLevelUp();
    }
  };

  return (
    <div className="min-h-screen bg-page text-foreground selection:bg-gold/30 selection:text-gold flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-border/80 bg-panel/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gold font-heading font-bold text-lg md:text-xl tracking-wider">
            <Sparkles className="w-5 h-5 text-gold" />
            Arcane Codex
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              aria-label="Sign in to your account"
              className="text-xs font-semibold px-4 py-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              aria-label="Create account"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-gold text-page hover:bg-gold/90 transition-transform active:scale-95 shadow-glow"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-4 text-center">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-xp/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Life RPG · Gamified Habit & Task Tracker
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
            Turn your real-life progress <br />
            <span className="text-gold">into a legend.</span>
          </h1>

          <p className="text-base md:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Connect your daily studying, fitness, routines, and mindfulness to verified character growth. Gain experience, accumulate treasury gold, vanquish weekly delay, and unlock atmospheric relics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              aria-label="Create free account and get started"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-page font-heading font-bold text-sm hover:bg-gold/90 transition-all transform active:scale-95 shadow-glow flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              aria-label="Sign in to your account"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-secondary border border-border text-foreground hover:border-gold/50 text-xs font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Simulation Sandbox */}
      <section className="max-w-4xl mx-auto px-4 pb-20 w-full">
        <div className="rounded-2xl border border-gold/30 bg-panel p-6 md:p-8 shadow-panel relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                  Interactive Simulator
                </span>
                <span className="text-xs text-foreground-muted">Client Sandbox Preview</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mt-1">
                Experience the Reward Loop
              </h2>
            </div>

            {/* Sandbox HUD preview */}
            <div className="flex items-center gap-3 text-xs bg-secondary/80 px-3.5 py-2 rounded-xl border border-border">
              <span className="font-bold text-xp">LVL {simLevel}</span>
              <span className="text-foreground-muted">·</span>
              <span className="font-bold text-xp tabular-nums">{simXp} XP</span>
              <span className="text-foreground-muted">·</span>
              <span className="font-bold text-gold tabular-nums">{simGold} Gold</span>
              <span className="text-foreground-muted">·</span>
              <span className="font-bold text-orange-400 flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-orange-400" /> {simStreak}d
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sampleQuests.map((q) => {
              const isDone = completedQuests[q.id];
              return (
                <div
                  key={q.id}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between gap-4 transition-all",
                    isDone
                      ? "bg-secondary/30 border-border/40 opacity-70"
                      : "bg-secondary/80 border-border hover:border-gold/40"
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-panel border border-border text-foreground">
                        {q.attr}
                      </span>
                      <span className="text-foreground-muted">{q.diff}</span>
                    </div>
                    <h3 className={cn("text-sm font-semibold text-foreground truncate", isDone && "line-through text-foreground-muted")}>
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                      <span className="text-xp">+{q.xp} XP</span>
                      <span className="text-gold">+{q.gold} Gold</span>
                    </div>

                    {isDone ? (
                      <span className="text-xs font-bold text-success flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
                        <Check className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSimComplete(q)}
                        className="text-xs font-bold px-4 py-1.5 rounded-lg bg-gold text-page hover:bg-gold/90 transition-transform active:scale-95 shadow-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {simLevel > 1 && (
            <div className="mt-4 p-3 rounded-xl bg-gold/10 border border-gold/30 text-center text-xs text-gold font-bold animate-pulse">
              Ascension confirmed! In the real app, Level 2 unlocks the Crimson Covenant and Emerald Grove themes.
            </div>
          )}
        </div>
      </section>

      {/* Pillars of the Arcane Codex */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border/60">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Built for Genuine Self-Improvement
          </h2>
          <p className="text-xs text-foreground-muted max-w-xl mx-auto">
            Unlike traditional habit apps that punish you or prototypes relying on fragile browser storage, Arcane Codex provides authentic persistence and supportive mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Scroll className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">PostgreSQL Persistence</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Every quest deed, gold ledger debit, inventory item, and achievement lives securely in PostgreSQL. Log in from any phone or computer and your heroic progress remains unbroken.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Grace Over Shame</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Missed a day? Your streak resets calmly without draining health, stealing hard-earned currency, or guilt-tripping you. You are building a sustainable lifestyle, not fighting fear.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-xp/10 border border-xp/30 flex items-center justify-center text-xp">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Transparent Game Engine</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Every XP calculation, streak multiplier, and attribute square-root formula is fully documented and enforced on the server. Zero pay-to-win, zero hidden penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border/60 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Frequently Asked Inquiries
          </h2>
          <p className="text-xs text-foreground-muted">
            Honest answers about the architecture, security, and gameplay of Arcane Codex.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-border bg-panel space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Is my progress saved if I refresh or change devices?</h3>
            <p className="text-foreground-muted leading-relaxed">
              Yes. Unlike mockups that rely on browser localStorage, Arcane Codex uses a production PostgreSQL database backed by Prisma ORM. Your character, quests, gold ledger, and inventory survive hard refreshes and cross-device sign-ins.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-panel space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">How does the app prevent cheating and timezone exploits?</h3>
            <p className="text-foreground-muted leading-relaxed">
              All reward logic runs authoritatively on the server. The activity timezone is locked after your first rewarded quest, and recurrence is governed by deterministic period keys (e.g. `DAY:2026-09-12`) rather than client timestamps.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-panel space-y-1.5">
            <h3 className="font-bold text-sm text-foreground">Does the app verify that I actually did the exercise or reading?</h3>
            <p className="text-foreground-muted leading-relaxed">
              Honesty Boundary: The server guarantees that rewards are calculated fairly and replay attacks are prevented, but it cannot physically verify offline activity. Arcane Codex is an accountability partner for your authentic self-improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-secondary/40 py-8 px-4 text-center text-xs text-foreground-muted space-y-2">
        <p className="font-heading font-bold text-foreground">Arcane Codex — Life RPG</p>
        <p>Turn your real-life progress into a legend. Built with Next.js 15, PostgreSQL, Prisma, and Tailwind CSS.</p>
        <p className="text-[11px] text-foreground-muted/70">
          Icons provided under ISC by Lucide. Typography provided under OFL by Google Fonts.
        </p>
      </footer>
    </div>
  );
}
