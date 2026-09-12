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
      label: "Strength",
      icon: <Dumbbell className="w-4 h-4 text-red-400" />,
      color: "text-red-400",
      bg: "bg-red-950/40 border-red-800/40",
      desc: "Physical vitality, conditioning, and bodily health.",
    },
    INTELLECT: {
      label: "Intellect",
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      color: "text-blue-400",
      bg: "bg-blue-950/40 border-blue-800/40",
      desc: "Deep work, coding, research, and memory acquisition.",
    },
    DISCIPLINE: {
      label: "Discipline",
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-800/40",
      desc: "Execution consistency, planning, and mental clarity.",
    },
    VITALITY: {
      label: "Vitality",
      icon: <Heart className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-800/40",
      desc: "Mindfulness, restorative sleep, nature, and recovery.",
    },
    CHARISMA: {
      label: "Charisma",
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-800/40",
      desc: "Communication, kindness, courage, and interpersonal bonds.",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header Banner */}
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
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {character.heroName}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-gold/40 bg-gold/10 text-gold font-bold">
              LVL {character.level}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-border bg-secondary text-foreground-muted">
              {character.className}
            </span>
          </div>

          <p className="text-sm font-medium text-gold flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4" />
            {character.equippedTitle || "Novice Adventurer"}
          </p>

          <p className="text-xs text-foreground-muted max-w-xl">
            Account of {user.displayName} · Activity anchored in {user.activityTimezone} timezone.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Lifetime XP</span>
              <span className="text-sm font-bold text-xp tabular-nums">{character.lifetimeXp.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Treasury Gold</span>
              <span className="text-sm font-bold text-gold tabular-nums">{character.gold.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Peak Streak</span>
              <span className="text-sm font-bold text-orange-400 tabular-nums">{character.longestStreak} Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Deeds Inscribed</span>
              <span className="text-sm font-bold text-success tabular-nums">{totalCompletions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Progression Section */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">Attributes of the Soul</h3>
            <p className="text-xs text-foreground-muted">
              Every quest completed nurtures its corresponding virtue using square-root threshold growth.
            </p>
          </div>
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
                    <span>Progress to Level {attr.level + 1}</span>
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
            <Trophy className="w-5 h-5 text-gold" />
            <h3 className="font-heading text-lg font-bold text-foreground">Unlocked Achievements</h3>
          </div>
          <span className="text-xs text-foreground-muted">
            {achievements.length} Badges Earned
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="py-8 text-center text-foreground-muted text-xs bg-secondary/30 rounded-xl border border-dashed border-border">
            Complete your first real-world quest to inscribe your initial achievement badge into the Codex!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3 rounded-xl border border-gold/30 bg-secondary/60 flex items-start gap-3 shadow-glow"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gold flex items-center gap-1">
                    {ach.title}
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  </h4>
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
