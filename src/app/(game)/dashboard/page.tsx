"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Swords,
  User,
  Coins,
  Scroll,
  Settings,
  PlusCircle,
  Sparkles,
  Loader2,
  Search,
  CheckCircle2,
} from "lucide-react";
import { CharacterHUD } from "@/components/game/CharacterHUD";
import { QuestCard } from "@/components/game/QuestCard";
import { QuestModal } from "@/components/game/QuestModal";
import { LevelUpModal } from "@/components/game/LevelUpModal";
import { CharacterSheet } from "@/components/game/CharacterSheet";
import { Marketplace } from "@/components/game/Marketplace";
import { Chronicle } from "@/components/game/Chronicle";
import { SettingsPanel } from "@/components/game/SettingsPanel";
import { BossCard } from "@/components/game/BossCard";
import { cn } from "@/lib/utils";

type ActiveTab = "quests" | "character" | "market" | "chronicle" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("quests");
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [levelUpData, setLevelUpData] = useState<{ fromLevel: number; toLevel: number } | null>(null);

  // Quest filter states
  const [cadenceFilter, setCadenceFilter] = useState("ALL");
  const [attributeFilter, setAttributeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch authenticated user profile and character
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (res.status === 401) {
        router.push("/login");
        throw new Error("Unauthorized");
      }
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json.data;
    },
  });

  // 2. Fetch quests
  const { data: questsData, isLoading: questsLoading } = useQuery({
    queryKey: ["quests", cadenceFilter, attributeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (cadenceFilter !== "ALL") params.set("cadence", cadenceFilter);
      if (attributeFilter !== "ALL") params.set("attribute", attributeFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/quests?${params.toString()}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json.data;
    },
    enabled: Boolean(userData),
  });

  // 3. Fetch shop items
  const { data: shopItems } = useQuery({
    queryKey: ["shop"],
    queryFn: async () => {
      const res = await fetch("/api/shop");
      const json = await res.json();
      return json.data;
    },
    enabled: activeTab === "market" || Boolean(userData),
  });

  // 4. Fetch history and activity
  const { data: historyData } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch("/api/history?limit=30");
      const json = await res.json();
      return json.data;
    },
    enabled: activeTab === "chronicle" || Boolean(userData),
  });

  const { data: activityData } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await fetch("/api/activity");
      const json = await res.json();
      return json.data;
    },
    enabled: activeTab === "chronicle" || Boolean(userData),
  });

  // 5. Fetch personal weekly boss
  const { data: bossData } = useQuery({
    queryKey: ["boss"],
    queryFn: async () => {
      const res = await fetch("/api/boss");
      const json = await res.json();
      return json.data;
    },
    enabled: Boolean(userData),
  });

  // Mutations
  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Failed to complete quest.");
      return json;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["boss"] });

      const levelUpEvent = result.events?.find((e: any) => e.type === "LEVEL_UP");
      if (levelUpEvent) {
        setLevelUpData({
          fromLevel: levelUpEvent.payload.fromLevel,
          toLevel: levelUpEvent.payload.toLevel,
        });
      }
    },
    onError: (err: any) => {
      alert(err.message || "Failed to confirm quest completion.");
    },
  });

  const forgeQuestMutation = useMutation({
    mutationFn: async (questData: any) => {
      const isEditing = Boolean(editingQuest);
      const url = isEditing ? `/api/quests/${editingQuest.id}` : "/api/quests";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questData),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      setEditingQuest(null);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to save quest.");
    },
  });

  const archiveQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const res = await fetch(`/api/quests/${questId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const purchaseItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch("/api/shop/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({ itemId }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Purchase failed.");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  const equipItemMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      const res = await fetch("/api/inventory/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-page text-gold gap-3" role="status">
        <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
        <p className="font-heading text-sm tracking-wide">Loading your adventurer dashboard...</p>
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-page text-center space-y-4">
        <p className="text-sm text-red-400">Failed to load user session.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded-lg bg-gold text-page font-bold text-xs shadow-glow"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  // Hybrid navigation tabs: clear standard primary terms with thematic hints
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    sublabel: string;
    ariaLabel: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "quests",
      label: "Dashboard",
      sublabel: "Quests",
      ariaLabel: "Dashboard and Active Quests",
      icon: <Swords className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: "character",
      label: "Profile",
      sublabel: "Character",
      ariaLabel: "User Profile and Character Stats",
      icon: <User className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: "market",
      label: "Shop",
      sublabel: "Bazaar",
      ariaLabel: "Cosmetics and Theme Shop",
      icon: <Coins className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: "chronicle",
      label: "History",
      sublabel: "Activity Log",
      ariaLabel: "Task Completion History and Heatmap",
      icon: <Scroll className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: "settings",
      label: "Settings",
      sublabel: "Account",
      ariaLabel: "Account Settings and Preferences",
      icon: <Settings className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="min-h-screen bg-page text-foreground pb-24 md:pb-12">
      {/* Sticky Character HUD */}
      <CharacterHUD character={userData.character} />

      {/* Main Content Layout with Sidebar Navigation */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Desktop Tab Navigation Bar */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-2 border-b border-border pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.ariaLabel}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                activeTab === tab.id
                  ? "bg-gold text-page border-gold shadow-glow"
                  : "bg-secondary text-foreground-muted border-border hover:text-foreground hover:bg-panel-elevated"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={cn(
                "text-[10px] font-normal px-1.5 py-0.5 rounded",
                activeTab === tab.id ? "bg-page/20 text-page font-semibold" : "bg-panel text-foreground-muted"
              )}>
                {tab.sublabel}
              </span>
            </button>
          ))}
        </nav>

        {/* Tab 1: Dashboard & Quest Board */}
        {activeTab === "quests" && (
          <div className="space-y-6 animate-fade-in">
            {/* Section Header with Hybrid Subtitle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-bold text-foreground">
                    Active Quests
                  </h1>
                  <span className="text-[11px] font-semibold text-gold px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30">
                    Daily To-Do List
                  </span>
                </div>
                <p className="text-xs text-foreground-muted mt-1">
                  Your daily task list — Complete real-world habits and goals to earn XP and Gold.
                </p>
              </div>

              {/* Add Quest Primary CTA */}
              <button
                onClick={() => {
                  setEditingQuest(null);
                  setQuestModalOpen(true);
                }}
                aria-label="Create new task or quest"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-page font-heading font-bold text-xs hover:bg-gold/90 transition-transform active:scale-95 shadow-glow shrink-0"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Add Task (New Quest)</span>
              </button>
            </div>

            {/* Weekly Boss Challenge Widget */}
            {bossData && <BossCard boss={bossData} />}

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-panel p-3 rounded-xl border border-border">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by name..."
                    aria-label="Search tasks by name"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-gold"
                  />
                </div>

                {/* Cadence Filter */}
                <select
                  value={cadenceFilter}
                  onChange={(e) => setCadenceFilter(e.target.value)}
                  aria-label="Filter tasks by frequency"
                  className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground outline-none"
                >
                  <option value="ALL">All Frequencies</option>
                  <option value="DAILY">Daily Habits</option>
                  <option value="WEEKLY">Weekly Goals</option>
                  <option value="ONCE">One-Time Tasks</option>
                </select>

                {/* Attribute Category Filter */}
                <select
                  value={attributeFilter}
                  onChange={(e) => setAttributeFilter(e.target.value)}
                  aria-label="Filter tasks by life attribute category"
                  className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="STRENGTH">Strength (Fitness & Health)</option>
                  <option value="INTELLECT">Intellect (Learning & Work)</option>
                  <option value="DISCIPLINE">Discipline (Routine & Focus)</option>
                  <option value="VITALITY">Vitality (Rest & Recovery)</option>
                  <option value="CHARISMA">Charisma (Social & Kindness)</option>
                </select>
              </div>
            </div>

            {/* Quest Grid */}
            {questsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-xl bg-secondary/40 border border-border animate-pulse" />
                ))}
              </div>
            ) : questsData?.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-panel p-6 space-y-3">
                <Swords className="w-10 h-10 text-gold/60 mx-auto" aria-hidden="true" />
                <h2 className="font-heading font-bold text-lg text-foreground">No Active Quests</h2>
                <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                  Your to-do list is currently empty. Inscribe a new custom task or choose from 52 pre-written habit templates.
                </p>
                <button
                  onClick={() => {
                    setEditingQuest(null);
                    setQuestModalOpen(true);
                  }}
                  aria-label="Open task templates"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold text-page font-bold text-xs hover:bg-gold/90 transition-all shadow-glow"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  Explore Habit Templates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questsData.map((q: any) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    onComplete={async (id) => {
                      await completeQuestMutation.mutateAsync(id);
                    }}
                    onEdit={(quest) => {
                      setEditingQuest(quest);
                      setQuestModalOpen(true);
                    }}
                    onArchive={async (id) => {
                      await archiveQuestMutation.mutateAsync(id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Character Sheet */}
        {activeTab === "character" && <CharacterSheet user={userData} />}

        {/* Tab 3: Shop & Cosmetics */}
        {activeTab === "market" && (
          <Marketplace
            items={shopItems || []}
            userGold={userData.character.gold}
            userLevel={userData.character.level}
            onPurchase={async (itemId) => {
              await purchaseItemMutation.mutateAsync(itemId);
            }}
            onEquip={async (itemId) => {
              await equipItemMutation.mutateAsync({ itemId });
            }}
          />
        )}

        {/* Tab 4: Activity History & Chronicle */}
        {activeTab === "chronicle" && (
          <Chronicle
            completions={historyData?.items || []}
            activityDays={activityData || []}
            totalCount={historyData?.totalCount || 0}
          />
        )}

        {/* Tab 5: Account Settings */}
        {activeTab === "settings" && (
          <SettingsPanel
            user={userData}
            onUpdateProfile={async (data) => {
              await updateProfileMutation.mutateAsync(data);
            }}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Quest Modal (Create / Edit / Templates) */}
      <QuestModal
        isOpen={questModalOpen}
        onClose={() => {
          setQuestModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={async (data) => {
          await forgeQuestMutation.mutateAsync(data);
        }}
        editingQuest={editingQuest}
      />

      {/* Level Up Celebratory Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={Boolean(levelUpData)}
          fromLevel={levelUpData.fromLevel}
          toLevel={levelUpData.toLevel}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Mobile Bottom Navigation Bar with Standard Labels */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-panel border-t border-border shadow-2xl flex items-center justify-around py-2 px-1 backdrop-blur-md bg-opacity-95"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.ariaLabel}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-semibold transition-colors",
              activeTab === tab.id ? "text-gold font-bold" : "text-foreground-muted hover:text-foreground"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
