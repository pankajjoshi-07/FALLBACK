"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Flame, Coins, Volume2, VolumeX, Shield, Sparkles } from "lucide-react";
import { useTheme } from "@/components/providers/ClientProviders";

interface CharacterHUDProps {
  character: {
    heroName: string;
    className: string;
    level: number;
    lifetimeXp: number;
    currentLevelXp: number;
    xpRequiredForNext: number;
    progressPercent: number;
    isMaxLevel: boolean;
    gold: number;
    effectiveStreak: number;
    equippedTheme: string;
    equippedAvatar: string;
    customAvatarUrl?: string | null;
    equippedTitle: string | null;
    equippedFrame: string | null;
  };
}

export function CharacterHUD({ character }: CharacterHUDProps) {
  const { soundEnabled, toggleSound, theme } = useTheme();

  const themeDisplayNames: Record<string, string> = {
    "theme-midnight": "Midnight Codex",
    "theme-crimson": "Crimson Covenant",
    "theme-emerald": "Emerald Grove",
  };

  const streakBonus = Math.min(Math.max(character.effectiveStreak - 1, 0), 25) * 2;

  return (
    <header className="bg-panel border-b border-border shadow-panel sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Avatar & Hero Identity */}
        <div className="flex items-center gap-3">
          <Avatar
            avatarKey={character.equippedAvatar}
            frameKey={character.equippedFrame}
            customAvatarUrl={character.customAvatarUrl}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base md:text-lg tracking-wide text-foreground">
                {character.heroName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded border border-border bg-secondary text-foreground-muted">
                {character.className}
              </span>
            </div>
            <p className="text-xs text-gold flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-gold" />
              {character.equippedTitle || "Novice Adventurer"}
            </p>
          </div>
        </div>

        {/* Center: Level & XP Progression Bar */}
        <div className="flex-1 min-w-[200px] max-w-md mx-auto order-3 md:order-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-xp/20 text-xp border border-xp/30">
                LVL {character.level}
              </span>
              <span className="text-foreground-muted hidden sm:inline">
                {character.isMaxLevel ? "Master of the Codex" : "Experience"}
              </span>
            </div>
            <span className="tabular-nums text-foreground-muted font-medium">
              {character.isMaxLevel ? (
                <span className="text-xp font-bold">MAX</span>
              ) : (
                `${character.currentLevelXp} / ${character.xpRequiredForNext} XP`
              )}
            </span>
          </div>

          <div
            className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/80 relative"
            role="progressbar"
            aria-valuenow={character.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Level progress"
          >
            <div
              className="bg-gradient-to-r from-xp to-xp-light h-full rounded-full transition-all duration-500 ease-out shadow-glow-xp"
              style={{ width: `${character.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Currency, Streak, Audio & Theme Badges */}
        <div className="flex items-center gap-3 order-2 md:order-3">
          {/* Gold Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border"
            title="Available Gold"
          >
            <Coins className="w-4 h-4 text-gold animate-bounce" style={{ animationDuration: "3s" }} />
            <span className="tabular-nums font-bold text-sm text-gold">
              {character.gold.toLocaleString()}
            </span>
          </div>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border group relative cursor-help"
            title={`Consecutive activity streak: ${character.effectiveStreak} days (+${streakBonus}% reward bonus)`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="tabular-nums font-bold text-sm text-foreground">
              {character.effectiveStreak}
            </span>
            {streakBonus > 0 && (
              <span className="text-[10px] text-orange-400 font-semibold hidden sm:inline">
                +{streakBonus}%
              </span>
            )}
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute game audio" : "Enable procedural game audio"}
            className="p-2 rounded-lg bg-secondary border border-border hover:border-gold/50 hover:bg-panel-elevated transition-colors text-foreground-muted hover:text-foreground"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-gold" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Active Theme Indicator */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-secondary border border-border text-foreground-muted">
            <Shield className="w-3 h-3 text-gold" />
            <span>{themeDisplayNames[theme] || "Midnight"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
