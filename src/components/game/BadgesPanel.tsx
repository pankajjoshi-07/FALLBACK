"use client";

import React from "react";
import { Award, Shield, Swords, Flame, Zap, Crown, BookOpen, Coins, Skull, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface UnlockedBadge extends Badge {
  unlockedAt: string;
}

interface BadgesPanelProps {
  allBadges: Badge[];
  unlockedBadges: UnlockedBadge[];
}

const getIcon = (iconName: string, className?: string) => {
  const props = { className: cn("w-8 h-8", className), "aria-hidden": true };
  switch (iconName) {
    case "award": return <Award {...props} />;
    case "shield": return <Shield {...props} />;
    case "swords": return <Swords {...props} />;
    case "flame": return <Flame {...props} />;
    case "zap": return <Zap {...props} />;
    case "crown": return <Crown {...props} />;
    case "book-open": return <BookOpen {...props} />;
    case "coins": return <Coins {...props} />;
    case "skull": return <Skull {...props} />;
    default: return <Award {...props} />;
  }
};

const getBadgeImage = (slug: string) => {
  const imageMap: Record<string, string> = {
    "first-quest": "/badges/badge_first_quest.jpg",
    "quests-10": "/badges/badge_quests_10.jpg",
    "quests-50": "/badges/badge_quests_50.jpg",
    "streak-7": "/badges/badge_streak_7.jpg",
    "streak-30": "/badges/badge_streak_30.jpg",
    "level-5": "/badges/badge_level_5.jpg",
    "intellect-1000": "/badges/badge_quests_10.jpg", // Fallback
    "first-purchase": "/badges/badge_quests_50.jpg", // Fallback
    "boss-slayer": "/badges/badge_streak_7.jpg", // Fallback
  };
  return imageMap[slug] || null;
};

const getCategoryColors = (category: string, isUnlocked: boolean) => {
  const baseColors: Record<string, string> = {
    QUEST: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    STREAK: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    LEVEL: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    ATTRIBUTE: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    ECONOMY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    BOSS: "text-red-400 bg-red-400/10 border-red-400/30",
  };
  
  const colors = baseColors[category] || "text-gold bg-gold/10 border-gold/30";
  return isUnlocked ? colors + " shadow-[0_0_15px_rgba(255,255,255,0.1)] opacity-100" : colors + " opacity-60";
};

export function BadgesPanel({ allBadges, unlockedBadges }: BadgesPanelProps) {
  const unlockedSlugs = new Set(unlockedBadges.map((b) => b.slug));

  // Create a map to quickly find when a badge was unlocked
  const unlockedAtMap = new Map(
    unlockedBadges.map((b) => [b.slug, b.unlockedAt])
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Badges & Achievements
            </h1>
            <span className="text-[11px] font-semibold text-gold px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30">
              {unlockedBadges.length} / {allBadges.length} Unlocked
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Track your milestones and collect badges by completing quests, defeating bosses, and mastering your skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedSlugs.has(badge.slug);
          const unlockedAt = isUnlocked ? new Date(unlockedAtMap.get(badge.slug)!).toLocaleDateString() : null;
          const customImage = getBadgeImage(badge.slug);

          return (
            <div
              key={badge.id}
              className={cn(
                "group relative flex flex-col p-5 rounded-2xl border transition-all duration-300 overflow-hidden",
                isUnlocked
                  ? "bg-secondary/40 border-gold/30 shadow-glow"
                  : "bg-panel border-border/50 hover:bg-secondary/10"
              )}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 p-1.5 rounded-full bg-background/80 border border-border z-10">
                  <Lock className="w-3 h-3 text-foreground-muted" />
                </div>
              )}
              
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 shadow-inner overflow-hidden relative",
                  isUnlocked && "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-500",
                  getCategoryColors(badge.category, isUnlocked)
                )}
              >
                {customImage ? (
                  <>
                    <img 
                      src={customImage} 
                      alt={badge.title} 
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
                        !isUnlocked && "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                      )} 
                    />
                    {isUnlocked && (
                      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[20deg] group-hover:animate-shine pointer-events-none" />
                    )}
                  </>
                ) : (
                  getIcon(badge.icon)
                )}
              </div>
              
              <h3 className={cn("font-heading font-bold text-base mb-1 transition-colors", isUnlocked ? "text-foreground" : "text-foreground-muted group-hover:text-foreground")}>
                {badge.title}
              </h3>

              <p className="text-xs text-foreground-muted mb-4 flex-1 z-10">
                {badge.description}
              </p>

              <div className="mt-auto pt-4 border-t border-border/30 z-10">
                {isUnlocked ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                    <Award className="w-3 h-3" />
                    Unlocked: {unlockedAt}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted flex items-center gap-1.5">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
