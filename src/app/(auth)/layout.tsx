import React from "react";
import { AuthRefreshGuard } from "@/components/auth/AuthRefreshGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthRefreshGuard />
      {children}
    </>
  );
}
