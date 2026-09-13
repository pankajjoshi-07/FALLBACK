"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/audio";
import { Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgePayload {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

interface BadgeUnlockModalProps {
  badges: BadgePayload[];
  onClose: () => void;
}

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

export function BadgeUnlockModal({ badges, onClose }: BadgeUnlockModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (badges.length > 0 && currentIndex < badges.length) {
      // Procedural audio for badge unlock
      try {
        sound.playLevelUp(); // Reusing level up sound for badge unlock
      } catch (e) {}

      // Confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#38BDF8", "#FDE047", "#818CF8"],
        });
      } catch {}
    }
  }, [badges, currentIndex]);

  if (!badges || badges.length === 0 || currentIndex >= badges.length) {
    return null;
  }

  const currentBadge = badges[currentIndex];
  const isLast = currentIndex === badges.length - 1;
  const customImage = getBadgeImage(currentBadge.slug);

  const handleNext = () => {
    if (isLast) {
      onClose();
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-panel border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] max-w-sm w-full rounded-2xl p-6 text-center relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="font-heading text-xl font-bold text-cyan-400 tracking-wide mb-6 uppercase">
          Achievement Unlocked!
        </h2>

        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/50 overflow-hidden relative group">
          {customImage ? (
            <img src={customImage} alt={currentBadge.title} className="w-full h-full object-cover" />
          ) : (
            <Award className="w-10 h-10 text-cyan-400" />
          )}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[20deg] animate-[shine_2s_infinite] pointer-events-none" />
        </div>

        <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
          {currentBadge.title}
        </h3>
        <p className="text-foreground-muted text-sm mb-6 px-2">
          {currentBadge.description}
        </p>

        <button
          onClick={handleNext}
          autoFocus
          className="w-full py-3 px-6 rounded-xl bg-cyan-600 text-white font-heading font-bold text-base hover:bg-cyan-500 transition-all transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
        >
          {isLast ? "Awesome!" : "Next Reward"}
          {!isLast && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
