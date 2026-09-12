"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sound } from "@/lib/audio";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "theme-midnight",
  setTheme: () => {},
  soundEnabled: false,
  toggleSound: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      })
  );

  const [theme, setThemeState] = useState<string>("theme-midnight");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Initial sound preference check
    setSoundEnabled(sound.isEnabled());

    // Check localStorage theme fallback
    const savedTheme = localStorage.getItem("arcane_theme");
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("arcane_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, setTheme, soundEnabled, toggleSound }}>
        {children}
        {/* Polite ARIA live region for screen-reader announcements */}
        <div id="arcane-a11y-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}
