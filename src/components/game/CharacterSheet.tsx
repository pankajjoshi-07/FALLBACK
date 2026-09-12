"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Award, Trophy, Sparkles, BookOpen, Dumbbell, Compass, Heart, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacterSheetProps {
  user: {
    displayName: string;
    activityTimezone: string;
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
      currentStreak: number;
      longestStreak: number;
      equippedTheme: string;
      equippedAvatar: string;
      equippedTitle: string | null;
      equippedFrame: string | null;
    };
    attributes: Record<
      string,
      {
        level: number;
        currentXp: number;
        currentLevelFloorXp: number;
        nextLevelThresholdXp: number;
        progressPercent: number;
      }
    >;
    achievements: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      category: string;
      unlockedAt: string;
    }>;
    totalCompletions: number;
  };
}

export function CharacterSheet({ user }: CharacterSheetProps) {
  const { character, attributes, achievements, totalCompletions } = user;

  const attrMeta: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; desc: string }> = {
    STRENGTH: {
      label: "Strength (Body & Fitness)",
      icon: <Dumbbell className="w-4 h-4 text-red-400" aria-hidden="true" />,
      color: "text-red-400",
      bg: "bg-red-950/40 border-red-800/40",
      desc: "Physical vitality, conditioning, and bodily health.",
    },
    INTELLECT: {
      label: "Intellect (Learning & Code)",
      icon: <BookOpen className="w-4 h-4 text-blue-400" aria-hidden="true" />,
      color: "text-blue-400",
      bg: "bg-blue-950/40 border-blue-800/40",
      desc: "Deep work, coding, research, and skill acquisition.",
    },
    DISCIPLINE: {
      label: "Discipline (Habits & Focus)",
      icon: <Compass className="w-4 h-4 text-amber-400" aria-hidden="true" />,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-800/40",
      desc: "Execution consistency, planning, and mental clarity.",
    },
    VITALITY: {
      label: "Vitality (Recovery & Rest)",
      icon: <Heart className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-800/40",
      desc: "Mindfulness, restorative sleep, hydration, and wellness.",
    },
    CHARISMA: {
      label: "Charisma (Social & Speech)",
      icon: <MessageSquare className="w-4 h-4 text-purple-400" aria-hidden="true" />,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-800/40",
      desc: "Communication, kindness, courage, and interpersonal connections.",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header Banner with Standardized Metrics */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <Avatar
          avatarKey={character.equippedAvatar}
          frameKey={character.equippedFrame}
          size="xl"
          className="shadow-2xl"
        />

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {character.heroName}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-gold/40 bg-gold/10 text-gold font-bold">
              Level {character.level}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-border bg-secondary text-foreground-muted">
              {character.className}
            </span>
          </div>

          <p className="text-sm font-medium text-gold flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {character.equippedTitle || "Novice Adventurer"}
          </p>

          <p className="text-xs text-foreground-muted max-w-xl">
            Account: {user.displayName} · Activity Timezone: {user.activityTimezone}
          </p>

          {/* Quick Metrics Bar with Standard Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Lifetime XP</span>
              <span className="text-sm font-bold text-xp tabular-nums">{character.lifetimeXp.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Gold Balance</span>
              <span className="text-sm font-bold text-gold tabular-nums">{character.gold.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Longest Streak</span>
              <span className="text-sm font-bold text-orange-400 tabular-nums">{character.longestStreak} Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Tasks Completed</span>
              <span className="text-sm font-bold text-success tabular-nums">{totalCompletions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Progression Section */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel space-y-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Attributes & Category Levels</h2>
          <p className="text-xs text-foreground-muted">
            Growth breakdown across your 5 core focus areas. Completing quests adds XP directly to the selected category.
          </p>
        </div>

        {/* 5 Attribute Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(attributes).map(([key, attr]) => {
            const meta = attrMeta[key] || attrMeta.INTELLECT;
            return (
              <div key={key} className={cn("p-4 rounded-xl border bg-secondary/40 space-y-2", meta.bg)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {meta.icon}
                    <span className={meta.color}>{meta.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-panel border border-border text-foreground">
                    LVL {attr.level}
                  </span>
                </div>

                <p className="text-[11px] text-foreground-muted leading-relaxed">{meta.desc}</p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-foreground-muted font-medium">
                    <span>Next Level Threshold</span>
                    <span className="tabular-nums font-semibold text-foreground">
                      {attr.currentXp} / {attr.nextLevelThresholdXp} XP
                    </span>
                  </div>
                  <div className="w-full bg-panel h-2 rounded-full overflow-hidden border border-border/60">
                    <div
                      className="bg-gold h-full rounded-full transition-all duration-300"
                      style={{ width: `${attr.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-foreground">Achievements & Badges</h2>
          </div>
          <span className="text-xs text-foreground-muted">
            {achievements.length} Badges Unlocked
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="py-8 text-center text-foreground-muted text-xs bg-secondary/30 rounded-xl border border-dashed border-border">
            Complete your first real-world quest to unlock your initial achievement badge.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3 rounded-xl border border-gold/30 bg-secondary/60 flex items-start gap-3 shadow-glow"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <Award className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gold flex items-center gap-1">
                    {ach.title}
                    <CheckCircle2 className="w-3 h-3 text-success" aria-hidden="true" />
                  </h3>
                  <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
