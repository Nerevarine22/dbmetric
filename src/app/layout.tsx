import type { Metadata } from "next";
import "./style.css";
import "./premium.css";
export const metadata: Metadata = {
  title: "Metric | Wallet Rank Checker",
  description:
    "Check any wallet's trading volume and liquidity provider rank on Metric. Explore exact ranks, Top 1% / 5% / 10% cohorts and wallet activity.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
