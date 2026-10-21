import type { Metadata } from "next";
import { ViewModeProvider } from "@/components/ViewModeProvider";
import DashboardShell from "@/components/DashboardShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Fairway Golf · Made for the game", template: "%s | Fairway" },
  description: "Explore and manage the Fairway golf equipment and apparel collection.",
};

// The root stays a Server Component; interactive header controls have small client boundaries.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><ViewModeProvider>
    <a href="#main" className="skip-link">Skip to content</a>
    <DashboardShell>
      <main id="main" className="page-shell">{children}</main>
    </DashboardShell>
  </ViewModeProvider></body></html>;
}
