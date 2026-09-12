"use client";

import React, { useState } from "react";
import { Scroll, Sparkles, Coins, Flame, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionItem {
  id: string;
  questTitle: string;
  difficulty: string;
  attribute: string;
  periodKey: string;
  xpAwarded: number;
  goldAwarded: number;
  streakSnapshot: number;
  localActivityDate: string;
  completedAt: string;
}

interface ActivityDayItem {
  localDate: string;
  completionCount: number;
  xpEarned: number;
  goldEarned: number;
}

interface ChronicleProps {
  completions: CompletionItem[];
  activityDays: ActivityDayItem[];
  totalCount: number;
}

export function Chronicle({ completions, activityDays, totalCount }: ChronicleProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Generate recent 12 weeks (84 days) calendar grid for the heatmap
  const heatmapDays = React.useMemo(() => {
    const daysMap = new Map(activityDays.map((d) => [d.localDate, d]));
    const result: Array<{ dateStr: string; count: number; xp: number }> = [];

    const now = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const entry = daysMap.get(dateStr);
      result.push({
        dateStr,
        count: entry ? entry.completionCount : 0,
        xp: entry ? entry.xpEarned : 0,
      });
    }
    return result;
  }, [activityDays]);

  const filteredCompletions = completions.filter(
    (c) => activeFilter === "ALL" || c.attribute === activeFilter
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Chronicle Header */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel">
        <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Scroll className="w-6 h-6 text-gold" />
          The Chronicle of Deeds
        </h2>
        <p className="text-xs text-foreground-muted mt-1">
          An immutable historical record of all completed quests, server-verified rewards, and activity consistency.
        </p>

        {/* Heatmap Activity Grid */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              Activity Heatmap (Past 12 Weeks)
            </span>
            <span className="text-[11px] text-foreground-muted">
              {activityDays.reduce((acc, d) => acc + d.completionCount, 0)} Total Recorded Completions
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
              {heatmapDays.map((day) => {
                let cellColor = "bg-secondary border-border/40";
                if (day.count >= 4) cellColor = "bg-gold border-gold shadow-glow";
                else if (day.count === 3) cellColor = "bg-amber-500 border-amber-600";
                else if (day.count === 2) cellColor = "bg-amber-700/80 border-amber-800";
                else if (day.count === 1) cellColor = "bg-amber-900/50 border-amber-900";

                return (
                  <div
                    key={day.dateStr}
                    title={`${day.dateStr}: ${day.count} quests (${day.xp} XP earned)`}
                    className={cn(
                      "w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer",
                      cellColor
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-[10px] text-foreground-muted pt-2">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-secondary border border-border/40 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-amber-900/50 border border-amber-900 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-amber-700/80 border border-amber-800 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-gold border border-gold inline-block" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Completion Audit Log */}
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-lg font-bold text-foreground">Audit Trail Snapshot</h3>

          <div className="flex flex-wrap gap-1.5">
            {["ALL", "STRENGTH", "INTELLECT", "DISCIPLINE", "VITALITY", "CHARISMA"].map((attr) => (
              <button
                key={attr}
                onClick={() => setActiveFilter(attr)}
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors border",
                  activeFilter === attr
                    ? "bg-gold text-page border-gold"
                    : "bg-secondary text-foreground-muted border-border hover:text-foreground"
                )}
              >
                {attr}
              </button>
            ))}
          </div>
        </div>

        {filteredCompletions.length === 0 ? (
          <div className="py-12 text-center text-xs text-foreground-muted bg-secondary/30 rounded-xl border border-dashed border-border">
            No completed quest records match the selected filter yet.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCompletions.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border bg-secondary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-border-bright transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-panel border border-border text-foreground">
                      {item.attribute}
                    </span>
                    <span className="text-[10px] text-foreground-muted">
                      {item.difficulty} · {item.periodKey}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{item.questTitle}</h4>
                  <span className="text-[11px] text-foreground-muted block">
                    Recorded on {item.localActivityDate} ({new Date(item.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                  <div className="flex items-center gap-1 text-xp">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{item.xpAwarded} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{item.goldAwarded}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Streak {item.streakSnapshot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
