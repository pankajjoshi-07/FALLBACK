"use client";

import React, { useState } from "react";
import { Settings, Volume2, VolumeX, Eye, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/providers/ClientProviders";

interface SettingsPanelProps {
  user: {
    displayName: string;
    activityTimezone: string;
    timezoneLocked: boolean;
    character: {
      heroName: string;
    };
  };
  onUpdateProfile: (data: { displayName?: string; heroName?: string }) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function SettingsPanel({ user, onUpdateProfile, onLogout }: SettingsPanelProps) {
  const { soundEnabled, toggleSound } = useTheme();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [heroName, setHeroName] = useState(user.character.heroName);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        displayName: displayName.trim() || undefined,
        heroName: heroName.trim() || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // Handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-panel p-6 shadow-panel">
        <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
          <Settings className="w-6 h-6 text-gold" aria-hidden="true" />
          Account Settings
        </h2>
        <p className="text-xs text-foreground-muted">
          Manage your personal profile, audio feedback, and system preferences.
        </p>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 mt-6 pt-5 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-display-name" className="block text-xs font-semibold text-foreground mb-1">
                Display Name
              </label>
              <input
                id="settings-display-name"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label htmlFor="settings-hero-name" className="block text-xs font-semibold text-foreground mb-1">
                Character Name <span className="text-foreground-muted font-normal">(Hero Moniker)</span>
              </label>
              <input
                id="settings-hero-name"
                type="text"
                required
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSaving}
              aria-label="Save profile changes"
              className="px-5 py-2 rounded-lg bg-gold text-page font-bold text-xs hover:bg-gold/90 transition-transform active:scale-95 shadow-glow"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Audio & Motion Preferences */}
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground">Sound & Audio Preferences</h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gold" aria-hidden="true" />
              ) : (
                <VolumeX className="w-5 h-5 text-foreground-muted" aria-hidden="true" />
              )}
              <div>
                <h4 className="text-xs font-bold text-foreground">Sound Effects (Web Audio)</h4>
                <p className="text-[11px] text-foreground-muted">
                  Gentle synthesized chime upon task completion and fanfare on level up.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                soundEnabled
                  ? "bg-gold text-page border-gold shadow-glow"
                  : "bg-secondary text-foreground-muted border-border hover:text-foreground"
              }`}
            >
              {soundEnabled ? "Enabled" : "Muted"}
            </button>
          </div>
        </div>

        {/* Timezone Security Information */}
        <div className="mt-8 pt-6 border-t border-border space-y-2">
          <h3 className="font-heading text-base font-bold text-foreground">Timezone & Streak Protection</h3>
          <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-foreground-muted space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldAlert className="w-4 h-4 text-gold" aria-hidden="true" />
              <span>Current Activity Timezone: {user.activityTimezone}</span>
            </div>
            <p className="leading-relaxed">
              To prevent streak manipulation and duplicate daily rewards, your activity timezone is locked on the server after your first rewarded quest.
            </p>
            <p className="text-[11px] text-foreground-muted/80 italic">
              Honesty Boundary: The backend strictly guarantees mathematical stat integrity, single-occurrence claims, and cryptographic replay protection. It cannot physically verify whether you performed an activity in real life.
            </p>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-foreground">Sign Out</h4>
            <p className="text-[11px] text-foreground-muted">Securely end your session on this device.</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out of your account"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 text-red-400 border border-red-800/50 hover:bg-red-900/60 hover:text-red-200 transition-colors text-xs font-bold"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
