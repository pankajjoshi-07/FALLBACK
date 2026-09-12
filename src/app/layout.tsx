import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Arcane Codex — Life RPG | Turn Your Real-Life Progress into a Legend",
  description:
    "A dark-fantasy productivity RPG that transforms everyday effort into visible heroic growth. Real PostgreSQL persistence, zero-shame streaks, and authentic character progression.",
  keywords: ["Life RPG", "Habit Tracker", "Gamified Productivity", "Arcane Codex", "Character Sheet", "Quest Board"],
  authors: [{ name: "Arcane Codex Order" }],
  openGraph: {
    title: "Arcane Codex — Life RPG",
    description: "Turn your real-life progress into a legend.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#0b0f19",
        },
      }}
    >
      <html lang="en" className="dark">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="antialiased min-h-screen bg-page text-foreground selection:bg-gold/30 selection:text-gold">
          {/* Skip to Content for Keyboard Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-page focus:font-bold focus:rounded-md shadow-lg"
          >
            Skip to Main Content
          </a>

          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
