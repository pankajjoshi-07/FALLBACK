"use client";

import React, { useState } from "react";
import { Coins, Sparkles, Check, Lock, Shield, Palette, User, Award } from "lucide-react";
import { useTheme } from "@/components/providers/ClientProviders";
import { sound } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface ShopItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  levelRequirement: number;
  effectKey: string;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
}

interface MarketplaceProps {
  items: ShopItem[];
  userGold: number;
  userLevel: number;
  onPurchase: (itemId: string) => Promise<void>;
  onEquip: (itemId: string, effectKey: string, category: string) => Promise<void>;
}

export function Marketplace({ items, userGold, userLevel, onPurchase, onEquip }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { setTheme } = useTheme();

  const categoryIcons: Record<string, React.ReactNode> = {
    THEME: <Palette className="w-3.5 h-3.5" />,
    AVATAR: <User className="w-3.5 h-3.5" />,
    TITLE: <Sparkles className="w-3.5 h-3.5" />,
    FRAME: <Shield className="w-3.5 h-3.5" />,
    BADGE: <Award className="w-3.5 h-3.5" />,
  };

  const filteredItems = items.filter(
    (item) => selectedCategory === "ALL" || item.category === selectedCategory
  );

  const handleBuy = async (item: ShopItem) => {
    if (processingId) return;
    setProcessingId(item.id);
    sound.playCoinPurchase();

    try {
      await onPurchase(item.id);
    } catch {
      // Handled in parent
    } finally {
      setProcessingId(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    if (processingId) return;
    setProcessingId(item.id);

    try {
      await onEquip(item.id, item.effectKey, item.category);

      // If theme, immediately apply CSS variable attribute to document root
      if (item.category === "THEME") {
        setTheme(item.effectKey);
      }
    } catch {
      // Handled in parent
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Merchant Bazaar Header */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Coins className="w-6 h-6 text-gold" />
            Merchant Bazaar
          </h2>
          <p className="text-xs text-foreground-muted mt-1">
            Exchange your earned gold for permanent visual relics, atmospheric themes, and heroic titles.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-gold/30 shadow-glow">
          <Coins className="w-5 h-5 text-gold" />
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted uppercase font-bold block">Available Gold</span>
            <span className="text-lg font-bold text-gold tabular-nums">{userGold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "THEME", "AVATAR", "TITLE", "FRAME", "BADGE"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border",
              selectedCategory === cat
                ? "bg-gold text-page border-gold shadow-glow"
                : "bg-secondary text-foreground-muted border-border hover:text-foreground hover:border-border-bright"
            )}
          >
            {categoryIcons[cat]}
            <span>{cat === "ALL" ? "All Relics" : `${cat.charAt(0) + cat.slice(1).toLowerCase()}s`}</span>
          </button>
        ))}
      </div>

      {/* Item Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLockedByLevel = userLevel < item.levelRequirement;
          const isAffordable = userGold >= item.price;

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border bg-panel p-5 shadow-panel flex flex-col justify-between gap-4 transition-all relative overflow-hidden",
                item.isEquipped
                  ? "border-gold ring-1 ring-gold/40 shadow-glow"
                  : item.isOwned
                  ? "border-success/40 bg-secondary/30"
                  : "border-border hover:border-border-bright"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary border border-border text-foreground-muted flex items-center gap-1">
                    {categoryIcons[item.category]}
                    {item.category}
                  </span>

                  {item.levelRequirement > 1 && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border",
                        isLockedByLevel
                          ? "bg-red-950/40 text-red-400 border-red-800/40"
                          : "bg-secondary text-foreground-muted border-border"
                      )}
                    >
                      Req. LVL {item.levelRequirement}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base text-foreground mb-1">{item.name}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{item.description}</p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-bold text-sm text-gold">
                  <Coins className="w-4 h-4" />
                  <span className="tabular-nums">{item.price}</span>
                </div>

                {item.isEquipped ? (
                  <span className="text-xs font-bold text-gold px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/40 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Equipped
                  </span>
                ) : item.isOwned ? (
                  <button
                    onClick={() => handleEquip(item)}
                    disabled={Boolean(processingId)}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-secondary border border-border hover:border-gold text-foreground transition-all"
                  >
                    Equip Relic
                  </button>
                ) : isLockedByLevel ? (
                  <span className="text-xs font-medium text-foreground-muted px-3 py-1.5 rounded-lg bg-secondary/50 border border-border flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked (LVL {item.levelRequirement})
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!isAffordable || Boolean(processingId)}
                    className={cn(
                      "text-xs font-bold px-4 py-1.5 rounded-lg transition-all transform active:scale-95 shadow-sm",
                      isAffordable
                        ? "bg-gold text-page hover:bg-gold/90 shadow-glow"
                        : "bg-secondary text-foreground-muted border border-border cursor-not-allowed opacity-60"
                    )}
                  >
                    {processingId === item.id ? "Purchasing..." : isAffordable ? "Purchase" : "Need Gold"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
