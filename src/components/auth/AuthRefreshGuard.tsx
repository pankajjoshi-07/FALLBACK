"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthRefreshGuard() {
  const router = useRouter();

  useEffect(() => {
    let isReload = false;

    try {
      // 1. Navigation Timing API Level 2 check
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload") {
        isReload = true;
      }
      // 2. Navigation Timing API Level 1 fallback
      else if ((performance as unknown as { navigation?: { type: number } })?.navigation?.type === 1) {
        isReload = true;
      }
      // 3. SessionStorage reload marker check
      else if (sessionStorage.getItem("arcane_auth_reload") === "true") {
        isReload = true;
      }

      sessionStorage.removeItem("arcane_auth_reload");
    } catch {
      // Fallback in case storage or performance APIs are restricted
    }

    if (isReload) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      window.location.replace("/");
      return;
    }

    // Set flag right before document unloads so reload can be detected even across edge browser versions
    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem("arcane_auth_reload", "true");
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var isReload = false;
              if (window.performance && window.performance.getEntriesByType) {
                var entries = window.performance.getEntriesByType('navigation');
                if (entries && entries.length > 0 && entries[0].type === 'reload') {
                  isReload = true;
                }
              }
              if (!isReload && window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
                isReload = true;
              }
              if (!isReload && window.sessionStorage && window.sessionStorage.getItem('arcane_auth_reload') === 'true') {
                isReload = true;
              }
              if (window.sessionStorage) {
                window.sessionStorage.removeItem('arcane_auth_reload');
              }
              if (isReload) {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                window.location.replace('/');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}
