"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/audio";
import { Crown, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  fromLevel: number;
  toLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, fromLevel, toLevel, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Procedural audio fanfare
      sound.playLevelUp();

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E8B44A", "#8B5CF6", "#34D399", "#38BDF8"],
        });
      } catch {
        // Fallback if canvas-confetti is not rendered
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      <div className="bg-panel border-2 border-gold shadow-glow max-w-md w-full rounded-2xl p-6 text-center relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-4 text-gold">
          <Crown className="w-8 h-8 animate-bounce" />
        </div>

        <h2 id="levelup-title" className="font-heading text-2xl md:text-3xl font-bold text-gold tracking-wide mb-1">
          Heroic Ascension!
        </h2>
        <p className="text-foreground-muted text-sm mb-6">
          Your steadfast discipline in the waking realm has elevated your spirit.
        </p>

        {/* Level Progression Indicator */}
        <div className="flex items-center justify-center gap-6 py-4 px-6 bg-secondary/80 rounded-xl border border-border mb-6">
          <div className="text-center">
            <span className="text-xs text-foreground-muted uppercase font-semibold">Previous</span>
            <div className="text-2xl font-bold text-foreground-muted tabular-nums">LVL {fromLevel}</div>
          </div>
          <ArrowRight className="w-6 h-6 text-gold animate-pulse" />
          <div className="text-center">
            <span className="text-xs text-gold uppercase font-semibold">Ascended</span>
            <div className="text-3xl font-black text-gold tabular-nums">LVL {toLevel}</div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-foreground-muted mb-6 bg-panel-elevated p-3 rounded-lg border border-border text-left">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Increased prestige and unlock eligibility at the Merchant Bazaar</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Higher tier relics and cosmetic themes now accessible</span>
          </div>
        </div>

        <button
          onClick={onClose}
          autoFocus
          className="w-full py-3 px-6 rounded-xl bg-gold text-page font-heading font-bold text-base hover:bg-gold/90 transition-all transform active:scale-95 shadow-glow"
        >
          Claim Glory & Continue
        </button>
      </div>
    </div>
  );
}
