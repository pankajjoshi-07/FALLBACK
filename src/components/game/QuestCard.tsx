"use client";

import React, { useState } from "react";
import { Check, Clock, Calendar, MoreVertical, Archive, Edit, Sparkles, Coins, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/audio";

interface QuestCardProps {
  quest: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    attribute: string;
    cadence: string;
    weeklyTarget: number;
    dueDate: string | null;
    isCompletedForPeriod: boolean;
    periodCompletionsCount: number;
    totalCompletionsCount: number;
    rewardPreview: {
      xpAwarded: number;
      goldAwarded: number;
      multiplierDecimal: number;
    };
  };
  onComplete: (questId: string) => Promise<void>;
  onEdit: (quest: QuestCardProps["quest"]) => void;
  onArchive: (questId: string) => Promise<void>;
}

export function QuestCard({ quest, onComplete, onEdit, onArchive }: QuestCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [floatingReward, setFloatingReward] = useState<{ xp: number; gold: number } | null>(null);

  const attributeColors: Record<string, { badge: string; border: string; text: string }> = {
    STRENGTH: { badge: "bg-red-950/40 text-red-400 border-red-800/40", border: "hover:border-red-600/40", text: "text-red-400" },
    INTELLECT: { badge: "bg-blue-950/40 text-blue-400 border-blue-800/40", border: "hover:border-blue-600/40", text: "text-blue-400" },
    DISCIPLINE: { badge: "bg-amber-950/40 text-amber-400 border-amber-800/40", border: "hover:border-amber-600/40", text: "text-amber-400" },
    VITALITY: { badge: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40", border: "hover:border-emerald-600/40", text: "text-emerald-400" },
    CHARISMA: { badge: "bg-purple-950/40 text-purple-400 border-purple-800/40", border: "hover:border-purple-600/40", text: "text-purple-400" },
  };

  const difficultyColors: Record<string, string> = {
    TRIVIAL: "text-foreground-muted",
    EASY: "text-emerald-400",
    MEDIUM: "text-blue-400",
    HARD: "text-amber-400",
    EPIC: "text-purple-400",
  };

  const attrStyle = attributeColors[quest.attribute] || attributeColors.INTELLECT;

  const handleCompleteClick = async () => {
    if (quest.isCompletedForPeriod || isSubmitting) return;

    setIsSubmitting(true);
    sound.playQuestComplete();

    // Floating celebration numbers
    setFloatingReward({
      xp: quest.rewardPreview.xpAwarded,
      gold: quest.rewardPreview.goldAwarded,
    });

    try {
      await onComplete(quest.id);
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFloatingReward(null), 1800);
    }
  };

  return (
    <article
      className={cn(
        "relative rounded-xl border bg-panel p-4 transition-all duration-200 shadow-panel flex flex-col justify-between gap-3 group",
        quest.isCompletedForPeriod
          ? "border-border/60 bg-panel/60 opacity-80"
          : cn("border-border", attrStyle.border)
      )}
    >
      {/* Floating confirmed reward animation */}
      {floatingReward && (
        <div className="absolute top-2 right-12 z-20 pointer-events-none flex items-center gap-2 text-xs font-bold animate-bounce bg-panel-elevated px-3 py-1.5 rounded-full border border-gold shadow-glow">
          <span className="text-xp">+{floatingReward.xp} XP</span>
          <span className="text-gold">+{floatingReward.gold} Gold</span>
        </div>
      )}

      <div>
        {/* Top Badges & Context Menu */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Attribute Badge */}
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", attrStyle.badge)}>
              {quest.attribute}
            </span>

            {/* Difficulty Badge */}
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border border-border bg-secondary", difficultyColors[quest.difficulty])}>
              {quest.difficulty}
            </span>

            {/* Cadence Badge */}
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-secondary text-foreground-muted">
              {quest.cadence === "WEEKLY" ? `Weekly (${quest.periodCompletionsCount}/${quest.weeklyTarget})` : quest.cadence}
            </span>
          </div>

          {/* Context Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label={`Options for quest: ${quest.title}`}
              className="p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 z-30 w-36 rounded-lg bg-panel-elevated border border-border shadow-xl py-1 text-xs text-foreground">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(quest);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5 text-foreground-muted" />
                  Edit Quest
                </button>
                <button
                  onClick={async () => {
                    setShowMenu(false);
                    if (confirm(`Archive quest "${quest.title}"? Your historical records will remain intact.`)) {
                      await onArchive(quest.id);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quest Title & Description */}
        <h3 className={cn("font-semibold text-base leading-snug mb-1 text-foreground", quest.isCompletedForPeriod && "line-through text-foreground-muted")}>
          {quest.title}
        </h3>

        {quest.description && (
          <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed mb-3">
            {quest.description}
          </p>
        )}
      </div>

      {/* Footer: Rewards Preview & Completion Action */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-2">
        {/* Reward Preview */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-xp" title="Calculated base XP plus streak bonus">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tabular-nums">+{quest.rewardPreview.xpAwarded} XP</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-gold" title="Reward currency">
            <Coins className="w-3.5 h-3.5" />
            <span className="tabular-nums">+{quest.rewardPreview.goldAwarded}</span>
          </div>
        </div>

        {/* Complete Action Button */}
        {quest.isCompletedForPeriod ? (
          <div className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-lg border border-success/30">
            <Check className="w-4 h-4" />
            <span>Completed</span>
          </div>
        ) : (
          <button
            onClick={handleCompleteClick}
            disabled={isSubmitting}
            aria-label={`Complete quest: ${quest.title}`}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gold text-page hover:bg-gold/90 transition-all transform active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <span className="animate-spin text-xs">⚔</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Complete</span>
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
