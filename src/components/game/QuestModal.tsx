"use client";

import React, { useState } from "react";
import { X, Search, Sparkles, BookOpen, PlusCircle } from "lucide-react";
import { INITIAL_TEMPLATES } from "@/server/game/seed-data";
import { DIFFICULTY_XP } from "@/server/game/progression";

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: {
    title: string;
    description?: string;
    difficulty: string;
    attribute: string;
    cadence: string;
    weeklyTarget: number;
    dueDate?: string | null;
  }) => Promise<void>;
  editingQuest?: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    attribute: string;
    cadence: string;
    weeklyTarget: number;
    dueDate: string | null;
  } | null;
}

export function QuestModal({ isOpen, onClose, onSubmit, editingQuest }: QuestModalProps) {
  const [tab, setTab] = useState<"custom" | "templates">(editingQuest ? "custom" : "custom");
  const [title, setTitle] = useState(editingQuest?.title || "");
  const [description, setDescription] = useState(editingQuest?.description || "");
  const [difficulty, setDifficulty] = useState(editingQuest?.difficulty || "MEDIUM");
  const [attribute, setAttribute] = useState(editingQuest?.attribute || "INTELLECT");
  const [cadence, setCadence] = useState(editingQuest?.cadence || "DAILY");
  const [weeklyTarget, setWeeklyTarget] = useState(editingQuest?.weeklyTarget || 1);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateAttrFilter, setTemplateAttrFilter] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
        attribute,
        cadence,
        weeklyTarget: cadence === "WEEKLY" ? weeklyTarget : 1,
      });
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdoptTemplate = (t: (typeof INITIAL_TEMPLATES)[number]) => {
    setTitle(t.title);
    setDescription(t.description);
    setDifficulty(t.difficulty);
    setAttribute(t.attribute);
    setCadence(t.cadence);
    setTab("custom");
  };

  const filteredTemplates = INITIAL_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesAttr = templateAttrFilter === "ALL" || t.attribute === templateAttrFilter;
    return matchesSearch && matchesAttr;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-panel border border-border shadow-2xl max-w-2xl w-full rounded-2xl p-6 relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header with Hybrid Subtitle */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 id="modal-title" className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" aria-hidden="true" />
              {editingQuest ? "Edit Quest Details" : "Create Quest (New Task)"}
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {editingQuest
                ? "Update your task description or deadline."
                : "Add a new real-world activity to your quest board to earn XP and Gold."}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Selector */}
        {!editingQuest && (
          <div className="flex border-b border-border mb-4 pt-2">
            <button
              onClick={() => setTab("custom")}
              aria-selected={tab === "custom"}
              className={`pb-2 px-4 text-xs font-semibold transition-colors border-b-2 ${
                tab === "custom" ? "border-gold text-gold" : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              Custom Task
            </button>
            <button
              onClick={() => setTab("templates")}
              aria-selected={tab === "templates"}
              className={`pb-2 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                tab === "templates" ? "border-gold text-gold" : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              Pre-Built Templates (52 Habits)
            </button>
          </div>
        )}

        {/* Tab 1: Custom Quest Form */}
        {tab === "custom" ? (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div>
              <label htmlFor="quest-title" className="block text-xs font-semibold text-foreground mb-1">
                Task Title *
              </label>
              <input
                id="quest-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 10 pages of software architecture"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label htmlFor="quest-desc" className="block text-xs font-semibold text-foreground mb-1">
                Notes & Description (Optional)
              </label>
              <textarea
                id="quest-desc"
                rows={2}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details, focus criteria, or helpful reminder notes..."
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quest-attribute" className="block text-xs font-semibold text-foreground mb-1">
                  Attribute Category
                </label>
                <select
                  id="quest-attribute"
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="STRENGTH">Strength (Physical Fitness & Body)</option>
                  <option value="INTELLECT">Intellect (Learning & Code)</option>
                  <option value="DISCIPLINE">Discipline (Routine & Focus)</option>
                  <option value="VITALITY">Vitality (Recovery & Mindfulness)</option>
                  <option value="CHARISMA">Charisma (Social & Kindness)</option>
                </select>
              </div>

              <div>
                <label htmlFor="quest-difficulty" className="block text-xs font-semibold text-foreground mb-1">
                  Difficulty Level ({DIFFICULTY_XP[difficulty]} Base XP)
                </label>
                <select
                  id="quest-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="TRIVIAL">TRIVIAL (10 XP, 6 Gold)</option>
                  <option value="EASY">EASY (25 XP, 15 Gold)</option>
                  <option value="MEDIUM">MEDIUM (50 XP, 30 Gold)</option>
                  <option value="HARD">HARD (90 XP, 54 Gold)</option>
                  <option value="EPIC">EPIC (150 XP, 90 Gold)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quest-cadence" className="block text-xs font-semibold text-foreground mb-1">
                  Repetition Cadence
                </label>
                <select
                  id="quest-cadence"
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                >
                  <option value="DAILY">Daily Habit (Resets each calendar day)</option>
                  <option value="WEEKLY">Weekly Goal (Configurable target per week)</option>
                  <option value="ONCE">One-Time Task (Single completion)</option>
                </select>
              </div>

              {cadence === "WEEKLY" && (
                <div>
                  <label htmlFor="quest-weekly-target" className="block text-xs font-semibold text-foreground mb-1">
                    Weekly Target (Completions per week)
                  </label>
                  <input
                    id="quest-weekly-target"
                    type="number"
                    min={1}
                    max={7}
                    value={weeklyTarget}
                    onChange={(e) => setWeeklyTarget(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border text-foreground-muted hover:text-foreground text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-gold text-page font-bold text-xs hover:bg-gold/90 transition-transform active:scale-95 shadow-glow"
              >
                {isSubmitting ? "Saving..." : editingQuest ? "Update Quest" : "Save Quest"}
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Template Codex */
          <div className="flex flex-col flex-1 overflow-hidden space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5" aria-hidden="true" />
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Search 52 habit templates..."
                  aria-label="Search habit templates"
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-gold"
                />
              </div>

              <select
                value={templateAttrFilter}
                onChange={(e) => setTemplateAttrFilter(e.target.value)}
                aria-label="Filter templates by category"
                className="text-xs px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-foreground outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="STRENGTH">Strength</option>
                <option value="INTELLECT">Intellect</option>
                <option value="DISCIPLINE">Discipline</option>
                <option value="VITALITY">Vitality</option>
                <option value="CHARISMA">Charisma</option>
              </select>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.slug}
                  className="p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-panel border border-border text-foreground">
                        {tmpl.attribute}
                      </span>
                      <span className="text-[10px] text-foreground-muted">
                        {tmpl.difficulty} · {tmpl.cadence}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-foreground truncate">{tmpl.title}</h3>
                    <p className="text-[11px] text-foreground-muted line-clamp-1">{tmpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleAdoptTemplate(tmpl)}
                    aria-label={`Use template: ${tmpl.title}`}
                    className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-page transition-colors shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
