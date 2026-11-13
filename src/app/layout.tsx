import type { Metadata } from "next";
import "./style.css";
export const metadata: Metadata = {
  title: "Metric | Trader Intelligence",
  description:
    "Wallet activity, volume leaderboards and trading concentration across Metric Protocol.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
