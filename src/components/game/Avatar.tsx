import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  avatarKey?: string | null;
  frameKey?: string | null;
  customAvatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ avatarKey = "avatar-warrior", frameKey = "frame-apprentice", customAvatarUrl, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const isGoldenFrame = frameKey === "frame-golden-aegis";

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center select-none transition-transform",
        sizeClasses[size],
        isGoldenFrame ? "ring-2 ring-gold shadow-glow p-1 bg-gradient-to-b from-panel to-panel-elevated" : "ring-1 ring-border bg-panel",
        className
      )}
    >
      {/* Dynamic Avatar Illustrations or Custom Upload */}
      {customAvatarUrl ? (
        <img src={customAvatarUrl} alt="Hero Avatar" className="w-full h-full object-cover rounded-full" />
      ) : avatarKey === "avatar-scholar" ? (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full p-2 text-info" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 18L24 12L36 18L24 24L12 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 20.5V28C16 31 19.5 34 24 34C28.5 34 32 31 32 28V20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : avatarKey === "avatar-monk" ? (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full p-2 text-success" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.15" />
          <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="2.5" />
          <path d="M14 36C14 30.5 18.5 27 24 27C29.5 27 34 30.5 34 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="20" r="1.5" fill="currentColor" />
        </svg>
      ) : avatarKey === "avatar-bard" ? (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full p-2 text-attr-charisma" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.15" />
          <path d="M18 16C18 16 20 22 20 26C20 30 17 33 22 34C27 35 30 31 29 27C28 23 27 18 31 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="25" r="2.5" fill="currentColor" />
          <path d="M16 14L20 17M27 13L31 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : avatarKey === "avatar-artisan" ? (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full p-2 text-gold" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.15" />
          <path d="M28 14L34 20L20 34L14 34L14 28L28 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 18L30 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : avatarKey === "avatar-anime-girl" ? (
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none w-full h-full flex items-center justify-center">
          <iframe
            src="https://www.youtube.com/embed/hV-7WgwYcx8?autoplay=1&mute=1&controls=0&loop=1&playlist=hV-7WgwYcx8&playsinline=1&rel=0&showinfo=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3"
            className="w-[300%] h-[300%] scale-[1.5] max-w-none max-h-none opacity-90"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            tabIndex={-1}
          />
        </div>
      ) : (
        // Default Warrior Avatar
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full p-2 text-danger" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.15" />
          <path d="M24 10L36 15V24C36 31 30.5 37 24 39C17.5 37 12 31 12 24V15L24 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 17V31M18 23H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {/* Frame Ornament Overlay */}
      {isGoldenFrame && (
        <div className="absolute -inset-1 rounded-full border border-gold/60 pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
