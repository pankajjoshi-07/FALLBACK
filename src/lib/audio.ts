/**
 * Arcane Codex — Audio Synthesizer Engine
 * Pure Web Audio API procedural sound synthesizer.
 * Completely eliminates broken external media links, massive binary assets, and copyright risks.
 * Sound is strictly opt-in and respects user preferences.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("arcane_audio_enabled");
      this.enabled = stored === "true";
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("arcane_audio_enabled", enabled ? "true" : "false");
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Delicate bell chime on quest completion
   */
  public playQuestComplete() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Two-note ascending crystalline chime (E5 -> B5)
      const frequencies = [659.25, 987.77];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Heroic ascending arpeggio fanfare on character level up
   */
  public playLevelUp() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // D-major heroic arpeggio: D4, F#4, A4, D5, F#5
      const notes = [293.66, 369.99, 440.0, 587.33, 739.99];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === notes.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        const duration = i === notes.length - 1 ? 0.9 : 0.35;
        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + duration);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Gilded metallic clink for market purchases
   */
  public playCoinPurchase() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(1920, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Graceful fallback
    }
  }
}

export const sound = new SoundEngine();
