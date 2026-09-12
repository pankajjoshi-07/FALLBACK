"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page text-gold gap-3">
      <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
      <p className="font-heading text-sm tracking-wide">Attuning Arcane Sanctuary SSO connection...</p>
      <AuthenticateWithRedirectCallback signInForceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard" />
    </div>
  );
}
