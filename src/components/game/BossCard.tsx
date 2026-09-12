"use client";

import React from "react";
import { Skull, Swords, Trophy, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BossCardProps {
  boss: {
    name: string;
    maxHp: number;
    currentHp: number;
    isDefeated: boolean;
    rewardClaimed: boolean;
    progressPercent: number;
    recentStrikes: Array<{
      id: string;
      damage: number;
      dealtAt: string;
    }>;
  };
}

export function BossCard({ boss }: BossCardProps) {
  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100)));

  return (
    <div className="rounded-2xl border border-red-900/40 bg-gradient-to-b from-red-950/20 to-panel p-5 shadow-panel relative overflow-hidden">
      {/* Subtle ambient red glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 shadow-inner">
            <Skull className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-900/50">
                Weekly Adversary
              </span>
              {boss.isDefeated && (
                <span className="text-[10px] font-bold text-success px-2 py-0.5 rounded bg-success/10 border border-success/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Vanquished
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-base md:text-lg text-foreground mt-0.5">
              {boss.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-foreground-muted block font-medium">Weekly Bounty</span>
          <span className="text-xs font-bold text-gold flex items-center justify-end gap-1">
            <Sparkles className="w-3 h-3" /> +150 Gold & Glory
          </span>
        </div>
      </div>

      <p className="text-xs text-foreground-muted mb-4 leading-relaxed">
        Completing your real-life quests channels damage directly into the Keeper of Delay. Defeat it before Sunday midnight!
      </p>

      {/* Boss Health Bar */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1 text-red-400">
            <Swords className="w-3.5 h-3.5" />
            {boss.isDefeated ? "Defeated" : "Entity HP"}
          </span>
          <span className="tabular-nums text-foreground-muted">
            {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP ({hpPercent}%)
          </span>
        </div>

        <div
          className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-border relative"
          role="progressbar"
          aria-valuenow={boss.currentHp}
          aria-valuemin={0}
          aria-valuemax={boss.maxHp}
          aria-label="Boss Health"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              boss.isDefeated
                ? "bg-success"
                : "bg-gradient-to-r from-red-600 to-rose-400 shadow-glow-crimson"
            )}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {boss.isDefeated ? (
        <div className="p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs text-success flex items-center gap-2">
          <Trophy className="w-4 h-4 shrink-0" />
          <span>Victory achieved for this week! Procrastinus will re-emerge next Monday refreshed.</span>
        </div>
      ) : (
        <div className="text-[11px] text-foreground-muted flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-gold" />
          <span>Every quest completed inflicts damage equal to its base XP.</span>
        </div>
      )}
    </div>
  );
}
