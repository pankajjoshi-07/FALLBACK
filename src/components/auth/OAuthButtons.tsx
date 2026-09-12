"use client";

import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import type { OAuthStrategy } from '@clerk/nextjs/types';
import { Loader2 } from "lucide-react";

interface OAuthButtonsProps {
  mode: "signIn" | "signUp";
  onError: (msg: string) => void;
}

export function OAuthButtons({ mode, onError }: OAuthButtonsProps) {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthClick = async (strategy: OAuthStrategy, providerName: string) => {
    try {
      setLoadingProvider(strategy);
      onError("");

      if (mode === "signUp") {
        if (!isSignUpLoaded || !signUp) return;
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      } else {
        if (!isSignInLoaded || !signIn) return;
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      }
    } catch (err: any) {
      console.error(`OAuth error (${providerName}):`, err);
      onError(err?.errors?.[0]?.message || `Failed to initiate ${providerName} sign in.`);
      setLoadingProvider(null);
    }
  };

  const providers = [
    {
      name: "Google",
      strategy: "oauth_google" as OAuthStrategy,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
          />
        </svg>
      ),
    },
    {
      name: "Apple",
      strategy: "oauth_apple" as OAuthStrategy,
      icon: (
        <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.36-.57.65-1.07 1.71-.93 2.73 1 .08 2.02-.49 2.64-1.24z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      strategy: "oauth_github" as OAuthStrategy,
      icon: (
        <svg className="w-4 h-4 text-foreground fill-current" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {providers.map((p) => {
          const isLoading = loadingProvider === p.strategy;
          return (
            <button
              key={p.strategy}
              type="button"
              disabled={Boolean(loadingProvider)}
              onClick={() => handleOAuthClick(p.strategy, p.name)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-xl border border-border bg-secondary/60 hover:bg-secondary hover:border-gold/50 text-foreground text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              aria-label={`Continue with ${p.name}`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : p.icon}
              <span className="truncate">{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        <div className="h-px flex-1 bg-border/80" />
        <span className="text-[11px] uppercase tracking-wider text-foreground-muted font-medium">
          or with credentials
        </span>
        <div className="h-px flex-1 bg-border/80" />
      </div>
    </div>
  );
}
