import type { Metadata } from "next";
import { LandingPage } from "@/src/components/LandingPage";

export const metadata: Metadata = {
  title: "Find your best travel credit card",
  description: "Compare Indian travel credit cards by rewards, lounge access, annual fee, and real-world value.",
};

export default function Home() {
  return <LandingPage />;
}
