"use client";

import React from "react";

interface ThemeBackgroundProps {
  themeKey: string;
}

const YOUTUBE_THEMES: Record<string, string> = {
  "theme-lofi-coding": "_ITiwPMUzho",
  "theme-synthwave-city": "YUlgGGekhbQ",
  "theme-magical-forest": "tP2jMESq-7A",
  "theme-anime-sunset": "qsa6pW6F7tI",
  "theme-cyberpunk-delorean": "Iv76oc22Qr4",
};

export function ThemeBackground({ themeKey }: ThemeBackgroundProps) {
  // Static background classes based on theme
  let bgClass = "bg-[#09090b]"; // default dark
  if (themeKey === "theme-palace-video" || YOUTUBE_THEMES[themeKey]) bgClass = "bg-black"; 

  const ytId = YOUTUBE_THEMES[themeKey];

  return (
    <div className={`fixed inset-0 z-[-1] ${bgClass} transition-colors duration-1000 overflow-hidden`}>
      {themeKey === "theme-palace-video" && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <video
            src="/palace.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80 pointer-events-none"
          />
        </div>
      )}
      
      {ytId && (
        <div className="absolute inset-0 w-[150vw] h-[150vh] -left-[25vw] -top-[25vh] pointer-events-none overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&rel=0&showinfo=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3`}
            className="w-full h-full scale-[1.3] opacity-80 pointer-events-none"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            tabIndex={-1}
          />
        </div>
      )}
      
      {/* Gradient overlay to make panels readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
    </div>
  );
}

